const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Helper function to generate unique username from OAuth profile
const generateUniqueUsername = async (displayName, email) => {
  let baseUsername = displayName || email.split('@')[0];
  baseUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
  
  let username = baseUsername;
  let count = 1;
  while (await User.findOne({ username })) {
    username = `${baseUsername}_${count}`;
    count++;
  }
  return username;
};

// 1. Google OAuth 2.0 Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const providerId = profile.id;
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@google.com`;
          const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

          let user = await User.findOne({ providerId, authProvider: 'google' });
          if (user) {
            return done(null, user);
          }

          const username = await generateUniqueUsername(profile.displayName, email);

          user = await User.create({
            username,
            email,
            avatar,
            authProvider: 'google',
            providerId,
            isProfileSetup: false,
            stats: {
              level: 1,
              exp: 0,
              bp: 1000,
              roomCredits: 1
            }
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// 2. GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const providerId = profile.id;
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
          const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : profile._json.avatar_url;

          let user = await User.findOne({ providerId, authProvider: 'github' });
          if (user) {
            return done(null, user);
          }

          const username = await generateUniqueUsername(profile.username || profile.displayName, email);

          user = await User.create({
            username,
            email,
            avatar,
            authProvider: 'github',
            providerId,
            isProfileSetup: false,
            stats: {
              level: 1,
              exp: 0,
              bp: 1000,
              roomCredits: 1
            }
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
