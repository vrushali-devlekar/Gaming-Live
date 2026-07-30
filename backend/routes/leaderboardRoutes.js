const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/leaderboard/top-squads - Dynamic top leaderboard entries
router.get('/top-squads', async (req, res) => {
  try {
    const topPlayers = await User.find({})
      .sort({ 'stats.bp': -1, winStreak: -1 })
      .limit(20)
      .select('username avatar rank winStreak stats selectedSkin')
      .lean();

    // Map to formatted leaderboard structure
    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      userId: player._id,
      handle: player.username,
      avatar: player.avatar || '🌟',
      tier: player.rank || 'CONQUEROR',
      winStreak: player.winStreak || 0,
      winRate: player.stats.matchesPlayed > 0 
        ? `${((player.stats.wins / player.stats.matchesPlayed) * 100).toFixed(1)}%` 
        : '85.0%',
      bp: player.stats.bp || 1000,
      totalSolves: player.stats.totalSolves || 0,
      selectedSkin: player.selectedSkin
    }));

    res.json({
      success: true,
      count: leaderboard.length,
      leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
});

module.exports = router;
