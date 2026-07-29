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
      enum: ['google', 'github'],
      required: true
    },
    providerId: {
      type: String,
      required: true,
      unique: true
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
        default: 1
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
