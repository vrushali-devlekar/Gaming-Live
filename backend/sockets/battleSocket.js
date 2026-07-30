const Match = require('../models/Match');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { executeCodeAgainstTestCases } = require('../services/compilerService');

// In-memory matchmaking queues per mode
const matchQueues = {
  '1v1': [],
  'Squad': [],
  'Royale': []
};

// Active room state tracking
const activeRooms = new Map();

function initBattleSocket(io) {
  const battleNamespace = io.of('/battle');

  battleNamespace.on('connection', (socket) => {
    console.log(`⚡ Battle Socket client connected: ${socket.id}`);

    let currentRoomId = null;
    let currentUser = null;

    /**
     * Event: arena:send_message
     * Real-time battle chat & quick radio commands handler
     */
    socket.on('arena:send_message', (data) => {
      try {
        const { matchId, senderId, senderName, senderAvatar, message, timestamp } = data;
        const msgPayload = {
          matchId,
          senderId: senderId || socket.id,
          senderName: senderName || 'OPERATOR',
          senderAvatar: senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${senderName || 'Op'}`,
          message,
          timestamp: timestamp || new Date()
        };

        const room = activeRooms.get(matchId);
        if (room) {
          room.combatLogs.push({
            timestamp: new Date(),
            event: 'CHAT_MESSAGE',
            details: `[RADIO] @${msgPayload.senderName}: ${message}`
          });
        }

        battleNamespace.to(matchId).emit('arena:receive_message', msgPayload);
      } catch (err) {
        console.error('Error in arena:send_message:', err);
      }
    });

    /**
     * Event: arena:create_challenge
     * Host initializes a Question-First 2-player challenge room
     */
    socket.on('arena:create_challenge', (data) => {
      try {
        const { matchId, problem, hostUser } = data;
        const roomId = matchId || `CHALLENGE_${Date.now()}`;
        currentRoomId = roomId;
        currentUser = hostUser || { username: 'HOST_OPERATOR', socketId: socket.id };

        socket.join(roomId);

        const roomState = {
          roomId,
          mode: '1v1',
          mapTheme: 'Erangel',
          problem: problem || { title: 'Two Sum Arena', testCases: [] },
          players: [
            {
              socketId: socket.id,
              userId: hostUser?.userId,
              username: hostUser?.username || 'HOST_OPERATOR',
              avatar: hostUser?.avatar,
              hp: 100,
              progress: 0,
              testsPassed: 0,
              totalTests: problem?.testCases ? problem.testCases.length : 3,
              isFinished: false
            }
          ],
          combatLogs: [
            { timestamp: new Date(), event: 'CHALLENGE_CREATED', details: `Room created by ${hostUser?.username || 'Host'}` }
          ]
        };

        activeRooms.set(roomId, roomState);

        socket.emit('arena:challenge_created', {
          roomId,
          message: 'Challenge room registered. Share match link with opponent.'
        });
      } catch (err) {
        console.error('Error in arena:create_challenge:', err);
      }
    });

    /**
     * Event: arena:join_room or arena:join_challenge
     * Invited guest opens match link or pastes code and joins room
     */
    const handleJoinRoom = (data) => {
      try {
        const { matchId, guestUser } = data;
        if (!matchId) return;

        const room = activeRooms.get(matchId);
        socket.join(matchId);
        currentRoomId = matchId;
        currentUser = guestUser || { username: 'GUEST_OPERATOR', socketId: socket.id };

        const guestProfile = {
          username: guestUser?.username || 'TARGET_ACQUIRED',
          avatar: guestUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${guestUser?.username || 'Guest'}`,
          hp: 100,
          progress: 0
        };

        if (room) {
          if (!room.players.some((p) => p.socketId === socket.id)) {
            room.players.push({
              socketId: socket.id,
              userId: guestUser?.userId,
              ...guestProfile
            });
          }
        }

        // Broadcast arena:opponent_joined to host & room members
        battleNamespace.to(matchId).emit('arena:opponent_joined', {
          matchId,
          guestUser: guestProfile,
          message: `[SYSTEM] @${guestProfile.username} connected to the tactical perimeter.`
        });
      } catch (err) {
        console.error('Error in handleJoinRoom:', err);
      }
    };

    socket.on('arena:join_room', handleJoinRoom);
    socket.on('arena:join_challenge', handleJoinRoom);

    /**
     * Event: matchmaking:join
     */
    socket.on('matchmaking:join', async (data) => {
      try {
        const { userId, username, mode = '1v1', mapTheme = 'Erangel' } = data;
        currentUser = { userId, username: username || `Coder_${socket.id.slice(0, 4)}`, socketId: socket.id };

        const queue = matchQueues[mode] || matchQueues['1v1'];
        if (queue.some((p) => p.socketId === socket.id)) return;

        queue.push({ ...currentUser, socket });

        socket.emit('matchmaking:queued', {
          message: `Enqueued in ${mode} battle queue...`,
          queueLength: queue.length
        });

        const requiredPlayers = mode === '1v1' ? 2 : mode === 'Squad' ? 4 : 2;

        if (queue.length >= requiredPlayers) {
          const matchedPlayers = queue.splice(0, requiredPlayers);
          const roomId = `ROOM_${mode.toUpperCase()}_${Date.now()}`;

          let problem = await Problem.findOne();
          if (!problem) {
            problem = {
              _id: 'default_prob_1',
              title: 'Two Sum Algorithmic Arena',
              description: 'Given an array of integers nums and an integer target, return indices of two numbers that add up to target.',
              sampleInput: '[2, 7, 11, 15], 9',
              sampleOutput: '[0, 1]',
              testCases: [
                { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false },
                { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isHidden: false }
              ]
            };
          }

          const roomState = {
            roomId,
            mode,
            mapTheme,
            problem,
            players: matchedPlayers.map((p) => ({
              socketId: p.socketId,
              userId: p.userId,
              username: p.username,
              hp: 100,
              progress: 0,
              testsPassed: 0,
              totalTests: problem.testCases.length,
              isFinished: false
            })),
            combatLogs: [
              { timestamp: new Date(), event: 'MATCH_STARTED', details: `Drop in complete! Solve problem: ${problem.title}` }
            ]
          };

          activeRooms.set(roomId, roomState);

          matchedPlayers.forEach((p) => {
            p.socket.join(roomId);
            p.socket.emit('arena:match_found', {
              roomId,
              mode,
              mapTheme,
              problem: {
                title: problem.title,
                description: problem.description,
                sampleInput: problem.sampleInput,
                sampleOutput: problem.sampleOutput,
                testCasesCount: problem.testCases.length
              },
              players: roomState.players.map((pl) => ({ username: pl.username, hp: pl.hp, progress: pl.progress }))
            });
          });
        }
      } catch (err) {
        console.error('Error in matchmaking:join:', err);
      }
    });

    /**
     * Event: arena:code_submit
     */
    socket.on('arena:code_submit', async (data) => {
      try {
        const { roomId, language = 'javascript', sourceCode } = data;
        const room = activeRooms.get(roomId);

        if (!room) {
          socket.emit('arena:error', { message: 'Match room not active' });
          return;
        }

        const player = room.players.find((p) => p.socketId === socket.id);
        if (!player) return;

        const evalResult = await executeCodeAgainstTestCases(language, sourceCode, room.problem.testCases || []);

        player.testsPassed = evalResult.passedCount;
        player.progress = Math.round((evalResult.passedCount / Math.max(1, evalResult.totalCount)) * 100);

        if (!evalResult.success) {
          player.hp = Math.max(0, player.hp - evalResult.hpDamage);
        }

        const logEntry = {
          timestamp: new Date(),
          event: evalResult.success ? 'CODE_PASSED' : 'CODE_FAILED',
          details: `${player.username} passed ${evalResult.passedCount}/${evalResult.totalCount} test cases. (HP: ${player.hp})`,
          userId: player.username
        };

        room.combatLogs.push(logEntry);

        battleNamespace.to(roomId).emit('arena:progress_update', {
          sender: player.username,
          players: room.players.map((p) => ({
            username: p.username,
            hp: p.hp,
            progress: p.progress,
            testsPassed: p.testsPassed,
            totalTests: p.totalTests
          })),
          evalResult: {
            success: evalResult.success,
            passedCount: evalResult.passedCount,
            totalCount: evalResult.totalCount,
            hpDamage: evalResult.hpDamage,
            executionTimeMs: evalResult.executionTimeMs,
            testResults: evalResult.testResults
          },
          combatLog: logEntry
        });

        if (evalResult.success || player.hp <= 0) {
          player.isFinished = true;
          handleMatchCompletion(battleNamespace, roomId, player, evalResult.success);
        }
      } catch (err) {
        console.error('Error in arena:code_submit:', err);
      }
    });

    /**
     * Event: arena:debuff_trigger
     */
    socket.on('arena:debuff_trigger', (data) => {
      const { roomId, debuffType } = data;
      socket.to(roomId).emit('arena:debuff_received', {
        debuffType,
        triggeredBy: currentUser ? currentUser.username : 'Rival Coder',
        durationSec: 15
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Battle Socket client disconnected: ${socket.id}`);
      Object.keys(matchQueues).forEach((mode) => {
        matchQueues[mode] = matchQueues[mode].filter((p) => p.socketId !== socket.id);
      });
    });
  });
}

function handleMatchCompletion(io, roomId, winnerPlayer, isVictory) {
  const room = activeRooms.get(roomId);
  if (!room) return;

  const winner = isVictory ? winnerPlayer : room.players.find((p) => p.socketId !== winnerPlayer.socketId) || winnerPlayer;

  const endLog = {
    timestamp: new Date(),
    event: 'MATCH_COMPLETED',
    details: `🏆 CHICKEN DINNER VICTORY! Winner: ${winner.username}`
  };
  room.combatLogs.push(endLog);

  io.to(roomId).emit('arena:match_end', {
    winner: winner.username,
    rewards: { bp: 2500, exp: 500, title: 'CHICKEN DINNER' },
    finalPlayers: room.players.map((p) => ({
      username: p.username,
      hp: p.hp,
      progress: p.progress,
      testsPassed: p.testsPassed
    })),
    combatLogs: room.combatLogs
  });

  setTimeout(() => activeRooms.delete(roomId), 10000);
}

module.exports = initBattleSocket;
