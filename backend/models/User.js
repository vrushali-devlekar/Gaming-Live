const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/bottts/svg?seed=GhostCoder'
    },
    authProvider: {
      type: String,
      enum: ['google', 'github', 'local', 'demo'],
      default: 'demo'
    },
    providerId: {
      type: String,
      default: null,
      sparse: true
    },
    isProfileSetup: {
      type: Boolean,
      default: false
    },
    rank: {
      type: String,
      enum: ['CONQUEROR', 'ACE MASTER', 'CROWN I', 'DIAMOND II', 'GOLD I'],
      default: 'GOLD I'
    },
    winStreak: {
      type: Number,
      default: 0
    },
    unlockedSkins: {
      type: [String],
      default: ['White Mummy Outfit', 'Standard IDE']
    },
    selectedSkin: {
      type: String,
      default: 'White Mummy Outfit'
    },
    stats: {
      level: {
        type: Number,
        default: 1
      },
      exp: {
        type: Number,
        default: 0
      },
      bp: {
        type: Number,
        default: 1000
      },
      roomCredits: {
        type: Number,
        default: 5
      },
      matchesPlayed: {
        type: Number,
        default: 0
      },
      wins: {
        type: Number,
        default: 0
      },
      totalSolves: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
