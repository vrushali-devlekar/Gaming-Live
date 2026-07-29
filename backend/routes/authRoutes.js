const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Helper to sign JWT tokens & attach HTTP-only cookie
const sendTokenResponse = (user, res) => {
  const secret = process.env.JWT_SECRET || 'codebattle_tactical_jwt_secret';
  const token = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    secret,
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  res.cookie('token', token, cookieOptions);

  const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/lobby`;
  res.redirect(redirectUrl);
};

// 1. Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    sendTokenResponse(req.user, res);
  }
);

// 2. GitHub OAuth Routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  (req, res) => {
    sendTokenResponse(req.user, res);
  }
);

// 3. GET /api/auth/me - Protected User Profile Route
router.get('/me', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
});

// 4. POST /api/auth/logout - Clear Auth Cookie
router.post('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  return res.status(200).json({
    success: true,
    message: 'Tactical session terminated cleanly'
  });
});

module.exports = router;
