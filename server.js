const { createServer } = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== 'production';
// In a real app, you'd integrate this with your Next.js server.
// For a hackathon, running it as a separate process is simpler.
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" }
});

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  // When a user joins a call, they join a "room" on our server too
  socket.on('join-call-room', (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room ${roomName}`);
  });

  // The PATIENT's browser sends media chunks here
  socket.on('stream-media-to-server', (data) => {
    const { roomName, audioChunk, videoChunk } = data;
    
    // TODO: Forward these chunks to the Hume WebSocket API
    // You would manage a WebSocket connection to Hume here.
    // For simplicity, we'll simulate the analysis result.
    
    // --- SIMULATED HUME ANALYSIS ---
    const simulatedAnalysis = {
      face: { emotions: { Joy: Math.random(), Sadness: Math.random() * 0.2 } },
      prosody: { emotions: { Calmness: Math.random(), Anxiety: Math.random() * 0.3 } }
    };
    // -------------------------------

    // Push the analysis ONLY to the doctor in that room.
    // We assume the doctor is the other client in the room.
    socket.to(roomName).emit('analysis-update-from-server', simulatedAnalysis);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log('Analysis Relay Server running on port 3001');
});