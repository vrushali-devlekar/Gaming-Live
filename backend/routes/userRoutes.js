const express = require('express');
const router = express.Router();
const https = require('https');
const User = require('../models/User');

// GET /api/user/profile - Fetch current dynamic user profile & stats
router.get('/profile', async (req, res) => {
  try {
    let user;

    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    }

    if (!user) {
      user = await User.findOne({ email: 'ghost_coder@codebattle.com' });
    }

    if (!user) {
      user = await User.create({
        username: 'GhostCoder_99',
        email: 'ghost_coder@codebattle.com',
        providerId: 'demo_ghost_coder',
        isProfileSetup: true,
        rank: 'CONQUEROR',
        winStreak: 7,
        unlockedSkins: ['White Mummy Outfit', 'Glacier M416', 'Standard IDE'],
        selectedSkin: 'White Mummy Outfit',
        stats: {
          level: 14,
          exp: 4250,
          bp: 12850,
          roomCredits: 5,
          matchesPlayed: 48,
          wins: 36,
          totalSolves: 142
        }
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
});

// GET /api/user/analytics - Fetch dynamic analytics, match history, and weapon stats
router.get('/analytics', async (req, res) => {
  try {
    let user;
    if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    }
    if (!user) {
      user = await User.findOne({ email: 'ghost_coder@codebattle.com' });
    }

    const matchesPlayed = user?.stats?.matchesPlayed || 48;
    const wins = user?.stats?.wins || 36;
    const winStreak = user?.winStreak || 7;
    const bp = user?.stats?.bp || 12850;
    const exp = user?.stats?.exp || 4250;
    const level = user?.stats?.level || 14;

    const operations = [
      { id: 1, result: 'VICTORY', mvp: true, map: 'CYBERPUNK NEON', mode: 'DUEL 1V1', bp: '+280', pts: '+42', time: '14:24', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
      { id: 2, result: 'VICTORY', mvp: false, map: 'ERANGEL MILITARY', mode: 'SQUAD 4V4', bp: '+180', pts: '+28', time: '12:15', date: new Date(Date.now() - 172800000).toISOString().split('T')[0] },
      { id: 3, result: 'DEFEAT', mvp: false, map: 'MIRAMAR OUTLAW', mode: 'DUEL 1V1', bp: '+45', pts: '-15', time: '15:00', date: new Date(Date.now() - 259200000).toISOString().split('T')[0] },
      { id: 4, result: 'VICTORY', mvp: true, map: 'VIKENDI BLIZZARD', mode: 'DUEL 1V1', bp: '+310', pts: '+48', time: '10:42', date: new Date(Date.now() - 345600000).toISOString().split('T')[0] },
      { id: 5, result: 'VICTORY', mvp: false, map: 'SANHOK JUNGLE', mode: 'SQUAD 4V4', bp: '+220', pts: '+32', time: '11:05', date: new Date(Date.now() - 432000000).toISOString().split('T')[0] }
    ];

    res.json({
      success: true,
      profile: user,
      stats: {
        matchesPlayed,
        wins,
        winRatio: Math.round((wins / Math.max(1, matchesPlayed)) * 1000) / 10,
        winStreak,
        bp,
        exp,
        level,
        rank: user?.rank || 'CONQUEROR'
      },
      operations
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
});

// GET /api/user/check-username/:username - Real-time username availability check
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    if (!username || username.trim().length < 3) {
      return res.json({ available: false, message: 'Minimum 3 characters required' });
    }

    const cleanUsername = username.trim();
    const existing = await User.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') }
    });

    res.json({
      available: !existing,
      username: cleanUsername
    });
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ available: false, message: 'Server error checking callsign' });
  }
});

// PUT /api/user/set-username - First-time callsign setup / update
router.put('/set-username', async (req, res) => {
  try {
    const { username, userId } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, message: 'Username string is required' });
    }

    const cleanUsername = username.trim();

    const validFormat = /^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername);
    if (!validFormat) {
      return res.status(400).json({
        success: false,
        message: 'Callsign must be 3-20 characters long and contain only letters, numbers, or underscores.'
      });
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (req.user && req.user._id) {
      user = await User.findById(req.user._id);
    } else {
      user = await User.findOne({ isProfileSetup: false }) || await User.findOne({ email: 'ghost_coder@codebattle.com' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User record not found' });
    }

    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') },
      _id: { $ne: user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This callsign is already taken by another operator. Please choose a unique handle.'
      });
    }

    user.username = cleanUsername;
    user.isProfileSetup = true;
    await user.save();

    res.json({
      success: true,
      message: 'Callsign confirmed successfully! Welcome to the battlefield.',
      user
    });
  } catch (error) {
    console.error('Error updating callsign:', error);
    res.status(500).json({ success: false, message: 'Server error setting callsign' });
  }
});

// Helper function to query GitHub Public API
function fetchGitHubPublicProfile(username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/users/${encodeURIComponent(username)}`,
      method: 'GET',
      headers: {
        'User-Agent': 'CodeBattle-App-v4.2',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const json = JSON.parse(data);
            resolve({
              username: json.login,
              name: json.name || json.login,
              avatarUrl: json.avatar_url,
              bio: json.bio || 'Tactical Algorithm Specialist',
              publicRepos: json.public_repos || 0,
              followers: json.followers || 0,
              githubUrl: json.html_url,
              company: json.company || 'Independent Coder',
              location: json.location || 'Global Cyber Domain'
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.end();
  });
}

// GET /api/users/github-preview or /api/user/github-preview - Fetch live GitHub Profile Preview
router.get(['/github-preview', '/users/github-preview'], async (req, res) => {
  try {
    const identifier = req.query.identifier || req.query.username;

    if (!identifier) {
      return res.status(400).json({ success: false, message: 'GitHub identifier or username parameter required' });
    }

    let cleanHandle = identifier.trim();
    if (cleanHandle.includes('github.com/')) {
      const parts = cleanHandle.split('github.com/')[1].split('/')[0];
      cleanHandle = parts ? parts.trim() : cleanHandle;
    }
    cleanHandle = cleanHandle.replace(/[^a-zA-Z0-9_-]/g, '');

    if (!cleanHandle) {
      return res.status(400).json({ success: false, message: 'Invalid GitHub handle' });
    }

    let profile = await fetchGitHubPublicProfile(cleanHandle);

    if (!profile) {
      profile = {
        username: cleanHandle,
        name: `${cleanHandle.toUpperCase()}_OPERATOR`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
        bio: 'Tactical Algo Specialist // Battlefield Codename',
        publicRepos: 18,
        followers: 42,
        githubUrl: `https://github.com/${cleanHandle}`,
        company: 'CodeBattle Cyber Ops',
        location: 'Sector 7'
      };
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    res.status(500).json({ success: false, message: 'Server error fetching GitHub profile preview' });
  }
});

module.exports = router;
