const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      enum: ['skin', 'editorTheme', 'emote'],
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    costBP: {
      type: Number,
      required: true
    },
    assetUrl: {
      type: String,
      default: ''
    },
    rarity: {
      type: String,
      enum: ['Legendary', 'Epic', 'Rare', 'Common'],
      default: 'Epic'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Inventory', inventorySchema);
