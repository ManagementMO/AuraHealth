// =========================================================================
// SECTION 1: IMPORTS & INITIAL SETUP
// =========================================================================

// Imports functionality from other libraries.
import express from 'express'; // Imports Express, a web framework for creating servers and HTTP endpoints.
import type { Request, Response } from 'express';
import cors from 'cors'; // Imports CORS middleware to allow requests from different origins (e.g., your frontend at localhost:3000).
import { createServer } from 'http'; // Imports Node.js's native HTTP module to create a server.
import { Server } from 'socket.io'; // Imports Socket.IO, the library for real-time, bidirectional communication.
import { HumeClient } from 'hume'; // Imports the official Hume AI Node.js SDK.
import dotenv from 'dotenv'; // Imports a library to load environment variables from a .env file.

// Executes the dotenv library's config function.
// This loads variables from a file named '.env' in your project into `process.env`.
dotenv.config();

// =========================================================================
// SECTION 2: SERVER AND SOCKET.IO CONFIGURATION
// =========================================================================

const app = express(); // Creates an instance of an Express application. This handles standard HTTP requests (like GET, POST).
const server = createServer(app); // Creates an HTTP server using Node's 'http' module and passes the Express app to it. Socket.IO will attach to this server.

// Creates a Socket.IO server instance and attaches it to the HTTP server.
const io = new Server(server, {
  cors: { // Configures Cross-Origin Resource Sharing (CORS) for the Socket.IO connection.
    // This is crucial. It explicitly allows your frontend application (running on a different port/domain) to connect to this server.
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow connections from multiple localhost variants
    methods: ['GET', 'POST'], // Specifies which HTTP methods are allowed for the connection handshake.
    credentials: true
  }
});

// =========================================================================
// SECTION 3: EXPRESS MIDDLEWARE
// =========================================================================

app.use(cors()); // Applies CORS middleware to the Express app for regular HTTP routes (like the /health endpoint).
app.use(express.json()); // Enables the Express app to parse incoming request bodies with JSON payloads.

// =========================================================================
// SECTION 4: HUME CLIENT & CONNECTION MANAGEMENT
// =========================================================================

// Initializes the Hume AI client.
const hume = new HumeClient({
  // It reads your API key from the environment variables loaded by dotenv. The '!' is a TypeScript non-null assertion.
  apiKey: process.env.HUME_API_KEY!,
});

// Creates a JavaScript Map to store active connections to the Hume API.
// This is the brain of your connection management.
// - Key: The unique `socket.id` of a client connected to YOUR server.
// - Value: The `humeSocket` object representing the connection to HUME's server for that client.
// This allows you to associate each of your clients with their own private, persistent connection to Hume.
const humeConnections = new Map<string, any>();

// Store room information for broadcasting analysis results
// Key: socket.id, Value: { roomName, userType }
const clientRooms = new Map<string, { roomName: string; userType: 'doctor' | 'patient' }>();

// =========================================================================
// SECTION 5: CORE REAL-TIME LOGIC (SOCKET.IO)
// =========================================================================

// Add connection debugging
io.engine.on("connection_error", (err) => {
  console.log('Socket.IO connection error:', err.req);      // the request object
  console.log('Error code:', err.code);     // the error code, for example 1
  console.log('Error message:', err.message);  // the error message, for example "Session ID unknown"
  console.log('Error context:', err.context);  // some additional error context
});

// This is the main event listener. The code inside this block runs every time a new client connects to your server via Socket.IO.
io.on('connection', (socket) => {
  // `socket` is an object that represents the individual connection to one specific client.
  console.log('Client connected successfully:', socket.id); // Logs the unique ID of the newly connected client.

  // --- Event Listener for 'join-room' ---
  // This allows clients to join a specific room for broadcasting analysis results
  socket.on('join-room', (data: { roomName: string; userType: 'doctor' | 'patient' }) => {
    console.log(`Client ${socket.id} joining room ${data.roomName} as ${data.userType}`);
    socket.join(data.roomName);
    clientRooms.set(socket.id, data);
    socket.emit('room-joined', { roomName: data.roomName });
  });

  // --- Event Listener for 'start-analysis' ---
  // This block runs when the connected client sends a message with the event name 'start-analysis'.
  socket.on('start-analysis', async () => {
    console.log('Starting emotion analysis for:', socket.id);
    
    try {
      // Security/Configuration Check: Ensures the API key is actually present.
      if (!process.env.HUME_API_KEY) {
        socket.emit('analysis-error', { message: 'Hume API key not configured' });
        return;
      }

      // **THE CRITICAL CONNECTION STEP**
      // This contacts the Hume API and establishes a persistent WebSocket connection.
      // This configuration tells Hume which models to initialize and have ready for this connection.
      const humeSocket = await hume.expressionMeasurement.stream.connect({
        config: {
          burst: {},    // Prepares the burst model.
          face: {},     // Prepares the facial expression model.
          facemesh: {}, // Prepares the face mesh model.
          language: {}, // Prepares the language model.
          prosody: {}   // Prepares the prosody model.
        }
      });

      // **THE CRITICAL ASSOCIATION STEP**
      // Stores the newly created `humeSocket` in our map, using the client's unique `socket.id` as the key.
      // Now, if this client (e.g., 'aBcDeF123') sends more data, we can look them up in the map and find their dedicated `humeSocket`.
      humeConnections.set(socket.id, humeSocket);

      // Sends a confirmation message back to only the client who initiated the request.
      socket.emit('analysis-started');
    } catch (error) {
      console.error('Error starting analysis:', error);
      // Sends a detailed error message back to the client if the connection to Hume fails.
      socket.emit('analysis-error', { message: error instanceof Error ? error.message : 'Failed to start analysis' });
    }
  });

  // --- Event Listener for 'analyze-frame' ---
  // This block runs when the client sends a frame of data (image, text, etc.) to be analyzed.
  socket.on('analyze-frame', async (data) => {
    console.log(`[Analysis Server] Received frame from ${socket.id}, type: ${data.type}`);
    // 1. Retrieve the correct Hume connection for this specific client from the map.
    const humeSocket = humeConnections.get(socket.id);
    
    // If for some reason there's no connection stored (e.g., they never started), send an error.
    if (!humeSocket) {
      socket.emit('analysis-error', { message: 'No active Hume connection' });
      return;
    }

    try {
      // **THE CORE REQUEST-RESPONSE LOGIC**
      if (data.type === 'image' && data.imageData) {
        // `await` pauses the function here and sends the image data to Hume.
        // The function only resumes when Hume has processed the image and sent the analysis back.
        // That analysis is the "response," which is then stored in the `result` variable.
        const result = await (humeSocket as any).sendFile({
            data: data.imageData.split(',')[1],
            models: { face: {}, facemesh: {} } // Example with multiple models
          });
        
        // Get the client's room information
        const clientRoom = clientRooms.get(socket.id);
        if (clientRoom) {
          // Broadcast the analysis result to all clients in the same room
          console.log(`[Analysis Server] Broadcasting analysis from ${clientRoom.userType} to room ${clientRoom.roomName}`);
          console.log(`[Analysis Server] Analysis result:`, JSON.stringify(result, null, 2));
          io.to(clientRoom.roomName).emit('emotion-data', {
            ...result,
            sourceClient: socket.id,
            userType: clientRoom.userType
          });
        } else {
          console.log(`[Analysis Server] No room found for ${socket.id}, sending to client only`);
          // Fallback: send only to the requesting client
          socket.emit('emotion-data', result);
        }
      } else if (data.type === 'text' && data.text) {
        // The exact same request-response pattern for text.
        const result = await (humeSocket as any).sendText({ text: data.text });
        
        // Get the client's room information
        const clientRoom = clientRooms.get(socket.id);
        if (clientRoom) {
          // Broadcast the analysis result to all clients in the same room
          io.to(clientRoom.roomName).emit('emotion-data', {
            ...result,
            sourceClient: socket.id,
            userType: clientRoom.userType
          });
        } else {
          // Fallback: send only to the requesting client
          socket.emit('emotion-data', result);
        }
      }
      // ... this pattern would be repeated for audio data ...
    } catch (error) {
      console.error('Error analyzing frame:', error);
      socket.emit('analysis-error', { message: error instanceof Error ? error.message : 'Failed to analyze frame' });
    }
  });

  // --- Event Listener for 'stop-analysis' ---
  // Runs when the client manually clicks a "stop" button.
  socket.on('stop-analysis', () => {
    console.log('Stopping analysis for:', socket.id);
    const humeSocket = humeConnections.get(socket.id); // Find the connection.
    if (humeSocket) {
      try {
        (humeSocket as any).close(); // Gracefully close the WebSocket connection to Hume's servers.
      } catch (error) {
        console.error('Error closing Hume socket:', error);
      }
      humeConnections.delete(socket.id); // Remove the entry from the map to free up memory. This is crucial cleanup.
    }
    socket.emit('analysis-stopped'); // Confirm to the client that the session has ended.
  });

  // --- Built-in Event Listener for 'disconnect' ---
  // This is a special, built-in Socket.IO event. It fires automatically when the client closes their browser tab, loses internet, etc.
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // This is a critical cleanup step to prevent memory leaks and orphaned connections.
    const humeSocket = humeConnections.get(socket.id); // Find any existing Hume connection.
    if (humeSocket) {
      try {
        (humeSocket as any).close(); // Close it.
      } catch (error) {
        console.error('Error closing Hume socket on disconnect:', error);
      }
      humeConnections.delete(socket.id); // And remove it from the map.
    }
    
    // Clean up room information
    clientRooms.delete(socket.id);
  });
});

// =========================================================================
// SECTION 6: HEALTH CHECK & SERVER START
// =========================================================================

// Creates a simple HTTP GET endpoint for health checks. This is a standard practice for deployment environments
// to verify that the server application is running.
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Defines the port the server will listen on. Uses the value from .env or defaults to 3002.
const PORT = process.env.ANALYSIS_PORT || 3002;

// Starts the server and makes it listen for incoming connections on the specified port.
server.listen(PORT, () => {
  console.log(`Analysis server running on port ${PORT}`);
});