const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const ws = require('ws');
const url = require('url');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Keep existing Socket.io setup for Live Chat page compatibility
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Base route for health check
app.get('/', (req, res) => {
  res.send('Orizon Gaming Dashboard Socket Server is running.');
});

// Live Chat mock messages array (Socket.io)
const randomMessages = [
  { sender: 'X_Gamer_X', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Insane drive skills! 🔥' },
  { sender: 'LizzieFan', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100&auto=format&fit=crop&q=60', text: 'Love the neon graphics on the bridge' },
  { sender: 'ShadowPro', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=60', text: 'Squad up after this?' },
  { sender: 'Cyber_Knight', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', text: 'Poggers! 😮' },
  { sender: 'VibeCheck99', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60', text: 'Which cyberware build is this?' },
  { sender: 'Anderson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', text: 'Let\'s goooo!!' }
];

io.on('connection', (socket) => {
  console.log(`Socket.io client connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    io.emit('new_message', {
      id: Date.now() + Math.random(),
      sender: data.sender,
      avatar: data.avatar,
      text: data.text
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket.io client disconnected: ${socket.id}`);
  });
});

// Periodic chat stream updates
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
}, 4000);


// =========================================================================
// NATIVE WEBSOCKET SERVER FOR COLLABORATIVE SQUAD SYNCING
// =========================================================================

const wss = new ws.Server({ noServer: true });

// Active Rooms State Map:
// roomId -> Map(userId -> { ws, name, color, cursor: {line, ch}, hp, testsPassed })
const rooms = new Map();

wss.on('connection', (socket, request) => {
  let currentRoomId = null;
  let currentUserId = null;

  console.log('Native WS client handshake established.');

  socket.on('message', (messageBuffer) => {
    try {
      const message = JSON.parse(messageBuffer.toString());
      const { type, payload } = message;

      switch (type) {
        case 'JOIN_ROOM': {
          const { roomId, userId, name, color } = payload;
          currentRoomId = roomId;
          currentUserId = userId;

          console.log(`User ${name} (${userId}) joining Room ${roomId}`);

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Map());
          }

          const roomMembers = rooms.get(roomId);
          
          // Limit to 3-player squads
          if (roomMembers.size >= 3 && !roomMembers.has(userId)) {
            socket.send(JSON.stringify({
              type: 'ROOM_FULL',
              payload: { message: 'This squad lobby is currently full (Max 3 players).' }
            }));
            socket.close();
            return;
          }

          // Register member state
          roomMembers.set(userId, {
            ws: socket,
            name,
            color: color || '#FACC15',
            cursor: { line: 1, ch: 0 },
            hp: 100,
            testsPassed: 10
          });

          // Broadcast updated squad state to all players in the room
          broadcastSquadState(roomId);
          break;
        }

        case 'CODE_UPDATE': {
          if (!currentRoomId || !currentUserId) return;
          const { code } = payload;
          
          // Broadcast raw code change to other members
          broadcastToRoomOthers(currentRoomId, currentUserId, {
            type: 'CODE_UPDATE',
            payload: { userId: currentUserId, code }
          });
          break;
        }

        case 'CURSOR_UPDATE': {
          if (!currentRoomId || !currentUserId) return;
          const { line, ch } = payload;

          // Update saved member cursor state
          const roomMembers = rooms.get(currentRoomId);
          if (roomMembers && roomMembers.has(currentUserId)) {
            roomMembers.get(currentUserId).cursor = { line, ch };
          }

          // Broadcast to other members
          broadcastToRoomOthers(currentRoomId, currentUserId, {
            type: 'CURSOR_UPDATE',
            payload: { userId: currentUserId, cursor: { line, ch } }
          });
          break;
        }

        default:
          console.warn(`Unhandled WS message type: ${type}`);
      }
    } catch (err) {
      console.error('Failed to parse WS message packet:', err);
    }
  });

  socket.on('close', () => {
    console.log(`WS Client disconnected: ${currentUserId || 'unknown'}`);
    if (currentRoomId && currentUserId) {
      const roomMembers = rooms.get(currentRoomId);
      if (roomMembers) {
        roomMembers.delete(currentUserId);
        if (roomMembers.size === 0) {
          rooms.delete(currentRoomId);
          console.log(`Room ${currentRoomId} is empty. Disposing buffers.`);
        } else {
          broadcastSquadState(currentRoomId);
        }
      }
    }
  });
});

// Helper to broadcast squad status list
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

// Helper to broadcast to room excluding sender
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

// Handle native upgrade events
server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (wsConnection) => {
      wss.emit('connection', wsConnection, request);
    });
  } else {
    // Socket.io upgrade handler will process other paths
  }
});


server.listen(PORT, () => {
  console.log(`Socket & WebSocket Server is listening on port ${PORT}`);
});
