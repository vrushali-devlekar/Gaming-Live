const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true
    },
    mode: {
      type: String,
      enum: ['1v1', 'Squad', 'Royale'],
      default: '1v1'
    },
    mapTheme: {
      type: String,
      enum: ['Erangel', 'Sanhok', 'Miramar'],
      default: 'Erangel'
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem'
    },
    players: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: { type: String, required: true },
        hp: { type: Number, default: 100 },
        progress: { type: Number, default: 0 },
        testsPassed: { type: Number, default: 0 },
        totalTests: { type: Number, default: 0 },
        code: { type: String, default: '' },
        isFinished: { type: Boolean, default: false }
      }
    ],
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'completed', 'cancelled'],
      default: 'waiting'
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    combatLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        event: { type: String, required: true },
        details: { type: String, default: '' },
        userId: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Match', matchSchema);
