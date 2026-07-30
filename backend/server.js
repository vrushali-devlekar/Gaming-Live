require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const ws = require('ws');
const url = require('url');

// Passport configuration
require('./config/passport');

// Auth & REST routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const problemRoutes = require('./routes/problemRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

// Socket controllers
const initBattleSocket = require('./sockets/battleSocket');

const app = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration with credentials support
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

// Initialize Passport.js
app.use(passport.initialize());

// MongoDB Database Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/codebattle';
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully for CodeBattle backend.'))
  .catch((err) => console.warn('MongoDB connection warning (running in offline/mock mode):', err.message));

// Mount REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/inventory', inventoryRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CodeBattle Real-Time Engine & REST API Server',
    version: '4.2.0',
    timestamp: new Date()
  });
});

const server = http.createServer(app);

// Initialize Socket.io Server
const io = new Server(server, {
  cors: {
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Initialize Socket.io Battle Real-Time Controller
initBattleSocket(io);

// Live Chat mock stream (for backward compatibility)
const randomMessages = [
  { sender: 'X_Gamer_X', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=X_Gamer_X', text: 'Insane drive skills! 🔥' },
  { sender: 'LizzieFan', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LizzieFan', text: 'Love the neon graphics on the bridge' },
  { sender: 'ShadowPro', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ShadowPro', text: 'Squad up after this match?' },
  { sender: 'Cyber_Knight', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber_Knight', text: 'Chicken dinner incoming! 🐔' }
];

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    io.emit('new_message', {
      id: Date.now() + Math.random(),
      sender: data.sender,
      avatar: data.avatar,
      text: data.text
    });
  });
});

setInterval(() => {
  if (io.engine.clientsCount > 0) {
    const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    io.emit('new_message', {
      id: Date.now() + Math.random(),
      sender: randomMsg.sender,
      avatar: randomMsg.avatar,
      text: randomMsg.text
    });
  }
}, 5000);

// =========================================================================
// NATIVE WEBSOCKET SERVER FOR COLLABORATIVE SQUAD SYNCING
// =========================================================================
const wss = new ws.Server({ noServer: true });
const rooms = new Map();

wss.on('connection', (socket, request) => {
  let currentRoomId = null;
  let currentUserId = null;

  socket.on('message', (messageBuffer) => {
    try {
      const message = JSON.parse(messageBuffer.toString());
      const { type, payload } = message;

      switch (type) {
        case 'JOIN_ROOM': {
          const { roomId, userId, name, color } = payload;
          currentRoomId = roomId;
          currentUserId = userId;

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Map());
          }

          const roomMembers = rooms.get(roomId);
          roomMembers.set(userId, {
            ws: socket,
            name,
            color: color || '#FACC15',
            cursor: { line: 1, ch: 0 },
            hp: 100,
            testsPassed: 0
          });

          broadcastSquadState(roomId);
          break;
        }

        case 'CODE_UPDATE': {
          if (!currentRoomId || !currentUserId) return;
          broadcastToRoomOthers(currentRoomId, currentUserId, {
            type: 'CODE_UPDATE',
            payload: { userId: currentUserId, code: payload.code }
          });
          break;
        }

        case 'CURSOR_UPDATE': {
          if (!currentRoomId || !currentUserId) return;
          broadcastToRoomOthers(currentRoomId, currentUserId, {
            type: 'CURSOR_UPDATE',
            payload: { userId: currentUserId, cursor: payload }
          });
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Failed to parse WS message packet:', err);
    }
  });

  socket.on('close', () => {
    if (currentRoomId && currentUserId) {
      const roomMembers = rooms.get(currentRoomId);
      if (roomMembers) {
        roomMembers.delete(currentUserId);
        if (roomMembers.size === 0) {
          rooms.delete(currentRoomId);
        } else {
          broadcastSquadState(currentRoomId);
        }
      }
    }
  });
});

function broadcastSquadState(roomId) {
  const roomMembers = rooms.get(roomId);
  if (!roomMembers) return;

  const membersPayload = {};
  roomMembers.forEach((member, uId) => {
    membersPayload[uId] = {
      userId: uId,
      name: member.name,
      color: member.color,
      cursor: member.cursor,
      hp: member.hp,
      testsPassed: member.testsPassed
    };
  });

  const broadcastMsg = JSON.stringify({
    type: 'SQUAD_STATE_CHANGE',
    payload: { members: membersPayload }
  });

  roomMembers.forEach((member) => {
    if (member.ws.readyState === ws.OPEN) {
      member.ws.send(broadcastMsg);
    }
  });
}

function broadcastToRoomOthers(roomId, senderUserId, messageObj) {
  const roomMembers = rooms.get(roomId);
  if (!roomMembers) return;

  const broadcastMsg = JSON.stringify(messageObj);
  roomMembers.forEach((member, uId) => {
    if (uId !== senderUserId && member.ws.readyState === ws.OPEN) {
      member.ws.send(broadcastMsg);
    }
  });
}

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (wsConnection) => {
      wss.emit('connection', wsConnection, request);
    });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 CodeBattle Express + Socket.io + MongoDB Engine listening on port ${PORT}`);
});
