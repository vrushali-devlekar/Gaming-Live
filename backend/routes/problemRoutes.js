const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// GET /api/problems/random - Fetch an unsolved/random problem
router.get('/random', async (req, res) => {
  try {
    const difficulty = req.query.difficulty;
    const filter = difficulty ? { difficulty } : {};

    const count = await Problem.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No problems found in database. Run seed script first.'
      });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const problem = await Problem.findOne(filter).skip(randomIndex);

    res.json({
      success: true,
      problem: {
        id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        tags: problem.tags,
        driverCode: problem.driverCode,
        sampleInput: problem.sampleInput,
        sampleOutput: problem.sampleOutput,
        points: problem.points,
        testCases: problem.testCases.map((tc) => ({
          input: tc.input,
          expectedOutput: tc.isHidden ? '[HIDDEN]' : tc.expectedOutput,
          isHidden: tc.isHidden
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching random problem:', error);
    res.status(500).json({ success: false, message: 'Server error fetching problem' });
  }
});

// GET /api/problems/all - Fetch all problem titles & details
router.get('/all', async (req, res) => {
  try {
    const problems = await Problem.find({}).select('title difficulty tags points sampleInput sampleOutput');
    res.json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    console.error('Error fetching problems list:', error);
    res.status(500).json({ success: false, message: 'Server error fetching problems' });
  }
});

// GET /api/problems/:id - Fetch single problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.json({ success: true, problem });
  } catch (error) {
    console.error('Error fetching problem details:', error);
    res.status(500).json({ success: false, message: 'Server error fetching problem details' });
  }
});

module.exports = router;
