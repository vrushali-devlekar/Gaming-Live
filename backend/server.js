const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Base route for health check
app.get('/', (req, res) => {
  res.send('Orizon Gaming Dashboard Socket Server is running.');
});

const randomMessages = [
  { sender: 'X_Gamer_X', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Insane drive skills! 🔥' },
  { sender: 'LizzieFan', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=60', text: 'Love the neon graphics on the bridge' },
  { sender: 'ShadowPro', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=60', text: 'Squad up after this?' },
  { sender: 'Cyber_Knight', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', text: 'Poggers! 😮' },
  { sender: 'VibeCheck99', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60', text: 'Which cyberware build is this?' },
  { sender: 'Anderson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', text: 'Let\'s goooo!!' },
  { sender: 'RacerX', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=60', text: 'That car is so fast!' },
  { sender: 'GamerGirl_V', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Cyberpunk is looking so good in HDR' },
  { sender: 'PixelArtisan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', text: 'Wait, what mods are installed?' }
];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for user chat messages
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    // Broadcast message to all connected clients
    io.emit('new_message', {
      id: Date.now() + Math.random(),
      sender: data.sender,
      avatar: data.avatar,
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Simulate incoming live chat stream from the server
setInterval(() => {
  const numConnections = io.engine.clientsCount;
  if (numConnections > 0) {
    const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    io.emit('new_message', {
      id: Date.now() + Math.random(),
      sender: randomMsg.sender,
      avatar: randomMsg.avatar,
      text: randomMsg.text
    });
  }
}, 3000);

server.listen(PORT, () => {
  console.log(`Socket Server is listening on port ${PORT}`);
});
