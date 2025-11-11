import dotenv from "dotenv";
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

// Resolve and log the callback URL used at runtime for easier debugging in deployed environments
const resolvedBackendUrl = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL;
const resolvedGoogleCallback = process.env.GOOGLE_CALLBACK_URL || `${resolvedBackendUrl || 'http://localhost:4000'}/auth/google/callback`;
if (resolvedBackendUrl && (!googleClientId || !googleClientSecret)) {
  console.warn('⚠️ BACKEND_URL (or VITE_BACKEND_URL) is set but Google client ID/secret are missing; OAuth will not be enabled for Google.');
}

if (googleClientId && googleClientSecret) {
  console.info(`ℹ️ Google OAuth callback URL resolved to: ${resolvedGoogleCallback}`);
  passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: resolvedGoogleCallback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Try find user by provider id first
          let user = await User.findOne({
            oauthProvider: 'google',
            oauthId: profile.id
          });
          if (user) return done(null, user);

          const email = profile.emails?.[0]?.value;

          // Try find user by email
          user = await User.findOne({ email });
          if (user) {
            // Ensure name exists on existing accounts
            if (!user.name) {
              user.name =
                profile.displayName ||
                `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() ||
                email.split('@')[0];
            }

            user.oauthProvider = 'google';
            user.oauthId = profile.id;
            await user.save();
            return done(null, user);
          }

          // Create new user
          const resolvedName =
            profile.displayName ||
            `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() ||
            email.split('@')[0] ||
            "User";

          user = await User.create({
            name: resolvedName,
            email,
            oauthProvider: 'google',
            oauthId: profile.id,
            password: null
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('⚠️  Google OAuth not configured (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET missing)');
}

// GitHub OAuth Strategy
const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

// Resolve and log GitHub callback URL
const resolvedGithubCallback = process.env.GITHUB_CALLBACK_URL || `${resolvedBackendUrl || 'http://localhost:4000'}/auth/github/callback`;
if (resolvedBackendUrl && (!githubClientId || !githubClientSecret)) {
  console.warn('⚠️ BACKEND_URL (or VITE_BACKEND_URL) is set but GitHub client ID/secret are missing; OAuth will not be enabled for GitHub.');
}

if (githubClientId && githubClientSecret) {
  console.info(`ℹ️ GitHub OAuth callback URL resolved to: ${resolvedGithubCallback}`);
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: resolvedGithubCallback
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({
            oauthProvider: 'github',
            oauthId: profile.id.toString()
          });
          if (user) return done(null, user);

          const email = profile.emails?.[0]?.value || `${profile.username}@github.noreply`;

          user = await User.findOne({ email });
          if (user) {
            if (!user.name) {
              user.name =
                profile.displayName ||
                profile.username ||
                email.split("@")[0];
            }

            user.oauthProvider = 'github';
            user.oauthId = profile.id.toString();
            await user.save();
            return done(null, user);
          }

          const resolvedName =
            profile.displayName ||
            profile.username ||
            email.split("@")[0] ||
            "GitHub User";

          user = await User.create({
            name: resolvedName,
            email,
            oauthProvider: 'github',
            oauthId: profile.id.toString(),
            password: null
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('⚠️  GitHub OAuth not configured (GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing)');
}

export default passport;
