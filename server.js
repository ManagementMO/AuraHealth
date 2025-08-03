// File: server.js

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import WebSocket from "ws";
import express from "express";
import cors from "cors";

// --- Server Setup ---
// Create Express app with CORS
const app = express();

// Configure CORS for Express
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'analysis-relay' });
});

// Create HTTP server with Express app
const httpServer = createServer(app);

// Create Socket.IO server with proper CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001", 
      "http://127.0.0.1:3001"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  },
  allowEIO3: true, // Allow Engine.IO v3 clients
  transports: ['websocket', 'polling'] // Enable both transports
});

// This Map will store the active Hume WebSocket connection for each patient.
// Key: The patient's socket.io ID (e.g., 'aBcDeFg123')
// Value: The WebSocket instance connected to Hume's API
const humeConnections = new Map();

const HUME_API_KEY = process.env.HUME_API_KEY;
if (!HUME_API_KEY) {
  console.error(
    "HUME_API_KEY not found in .env file. The server will not work."
  );
  process.exit(1);
}

// Add connection error debugging
io.engine.on("connection_error", (err) => {
  console.log('Socket.IO connection error:', {
    code: err.code,
    message: err.message,
    context: err.context,
    type: err.type
  });
});

// --- Main Connection Logic ---
io.on("connection", (socket) => {
  console.log(`✅ Client connected successfully: ${socket.id}`);

  // This event is triggered by both the doctor and patient when they join the call page.
  socket.on("join-call-room", ({ roomName, userType }) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} (${userType}) joined room ${roomName}`);

    // If the user is the patient, we must establish a new connection to Hume's API for them.
    if (userType === "patient") {
      // Construct the Hume API WebSocket URL
      const humeSocketUrl = `wss://api.hume.ai/v0/stream/models?apiKey=${HUME_API_KEY}`;
      const humeSocket = new WebSocket(humeSocketUrl);

      // Store this new connection, associating it with the patient's socket ID.
      humeConnections.set(socket.id, humeSocket);

      humeSocket.on("open", () => {
        console.log(`Hume WebSocket opened for patient: ${socket.id}`);
      });

      // This is where we receive the analysis back from Hume.
      humeSocket.on("message", (data) => {
        const message = JSON.parse(data.toString());
        // console.log(`Received analysis from Hume for ${socket.id}:`, message);

        // Relay this analysis data to the doctor in the same room.
        // The doctor's frontend will be listening for this 'analysis-update' event.
        io.to(roomName).emit("analysis-update-from-server", message);
      });

      humeSocket.on("close", (code, reason) => {
        console.log(
          `Hume WebSocket closed for patient ${socket.id}: ${code} - ${reason}`
        );
        // Clean up the connection from our map when it closes.
        humeConnections.delete(socket.id);
      });

      humeSocket.on("error", (error) => {
        console.error(`Hume WebSocket error for patient ${socket.id}:`, error);
      });
    }
  });

  // This event is triggered only by the PATIENT's browser, sending media data.
  socket.on("stream-media-to-server", (data) => {
    const { videoChunk, audioChunk } = data; // Chunks are base64 encoded strings

    // Find the patient's specific Hume WebSocket connection.
    const humeSocket = humeConnections.get(socket.id);

    // Ensure the connection exists and is ready before sending data.
    if (humeSocket && humeSocket.readyState === WebSocket.OPEN) {
      // Construct the payload exactly as the Hume API requires.
      const payload = {
        models: {
          face: {}, // Enable facial expression analysis
          prosody: {}, // Enable vocal tone analysis
        },
        // We send the base64 encoded data string.
        // The Hume API is smart enough to handle audio and video data in the same field.
        // We prioritize video if available, otherwise audio.
        data: videoChunk || audioChunk,
      };

      humeSocket.send(JSON.stringify(payload));
    }
  });

  // This is the cleanup logic. It's crucial.
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    // If the disconnected client was a patient, we MUST close their Hume connection.
    if (humeConnections.has(socket.id)) {
      const humeSocket = humeConnections.get(socket.id);
      humeSocket.close();
      // The 'close' event listener above will handle deleting it from the map.
      console.log(
        `Cleaned up Hume connection for disconnected patient: ${socket.id}`
      );
    }
  });
});

// --- Start the Server ---
const PORT = process.env.PORT || 3003;
httpServer.listen(PORT, () => {
  console.log(`✅ Analysis Relay Server running on http://localhost:${PORT}`);
});
