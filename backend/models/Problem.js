const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    tags: [{ type: String }],
    driverCode: {
      javascript: { type: String, default: '' },
      cpp: { type: String, default: '' },
      python: { type: String, default: '' }
    },
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false }
      }
    ],
    sampleInput: { type: String, default: '' },
    sampleOutput: { type: String, default: '' },
    points: { type: Number, default: 100 }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Problem', problemSchema);
