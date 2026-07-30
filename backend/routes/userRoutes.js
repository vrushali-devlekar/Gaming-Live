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

    // Extract handle from full URL e.g. "https://github.com/octocat" -> "octocat"
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
      // Fallback structured avatar card if user not found on GitHub API
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
