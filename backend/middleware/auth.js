const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    let token = null;

    // 1. Extract from HTTP-only Cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Extract from Authorization Header (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied: Authentication token missing'
      });
    }

    const secret = process.env.JWT_SECRET || 'codebattle_tactical_jwt_secret';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-__v');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User profile not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired session token',
      error: error.message
    });
  }
};

module.exports = { authenticateToken };
