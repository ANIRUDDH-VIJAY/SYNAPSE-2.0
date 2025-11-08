import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import passport from '../config/passport.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// POST /auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Set secure HTTP-only cookie (token not in JSON response)
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Generate and set CSRF token (double-submit cookie pattern)
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, // Must be readable by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map(e => e.message).join(', ') || error.message;
      return res.status(400).json({ error: messages });
    }
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    next(error);
  }
});

// POST /auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user - explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'No account found with this email' });
    }

    // Check if user has a password (OAuth users might not)
    if (!user.password) {
      return res.status(400).json({ error: 'This account was created with OAuth. Please use Google or GitHub to sign in.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set secure HTTP-only cookie (token not in JSON response)
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Generate and set CSRF token (double-submit cookie pattern)
    const csrfToken = crypto.randomBytes(32).toString('hex');
    res.cookie('csrf_token', csrfToken, {
      httpOnly: false, // Must be readable by JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    // Handle Mongoose errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map(e => e.message).join(', ') || error.message;
      return res.status(400).json({ error: messages });
    }
    next(error);
  }
});

// GET /auth/me (protected)
router.get('/me', authenticate, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
});

// PUT /auth/profile (protected) - Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    // Update user
    req.user.name = name.trim();
    await req.user.save();

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map(e => e.message).join(', ') || error.message;
      return res.status(400).json({ error: messages });
    }
    next(error);
  }
});

// OAuth Routes

// Get frontend URL with fallback
const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
};

// Helper function to check if strategy is registered
const isStrategyRegistered = (strategyName) => {
  return passport._strategies && passport._strategies[strategyName];
};

// Google OAuth (only if configured)
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (googleClientId && googleClientSecret) {
  router.get('/google', (req, res, next) => {
    if (isStrategyRegistered('google')) {
      passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
    } else {
      res.status(503).json({ error: 'Google OAuth strategy is not registered' });
    }
  });

  router.get(
    '/google/callback',
    (req, res, next) => {
      if (isStrategyRegistered('google')) {
        passport.authenticate('google', { session: false, failureRedirect: `${getFrontendUrl()}?error=oauth_failed` })(req, res, next);
      } else {
        res.redirect(`${getFrontendUrl()}?error=oauth_failed`);
      }
    },
    async (req, res) => {
      try {
        const token = generateToken(req.user._id);
        // Set secure HTTP-only cookie with token (more secure than URL param)
        res.cookie('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Generate and set CSRF token
        const csrfToken = crypto.randomBytes(32).toString('hex');
        res.cookie('csrf_token', csrfToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // Redirect to frontend (token in cookie, no sensitive data in URL)
        res.redirect(`${getFrontendUrl()}?oauth=success`);
      } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect(`${getFrontendUrl()}?error=oauth_failed`);
      }
    }
  );
} else {
  router.get('/google', (req, res) => {
    res.status(503).json({ error: 'Google OAuth is not configured' });
  });
  router.get('/google/callback', (req, res) => {
    res.redirect(`${getFrontendUrl()}?error=oauth_failed`);
  });
}

// GitHub OAuth (only if configured)
const githubClientId = process.env.GITHUB_CLIENT_ID?.trim();
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET?.trim();

if (githubClientId && githubClientSecret) {
  router.get('/github', (req, res, next) => {
    if (isStrategyRegistered('github')) {
      passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
    } else {
      res.status(503).json({ error: 'GitHub OAuth strategy is not registered' });
    }
  });

  router.get(
    '/github/callback',
    (req, res, next) => {
      if (isStrategyRegistered('github')) {
        passport.authenticate('github', { session: false, failureRedirect: `${getFrontendUrl()}?error=oauth_failed` })(req, res, next);
      } else {
        res.redirect(`${getFrontendUrl()}?error=oauth_failed`);
      }
    },
    async (req, res) => {
      try {
        const token = generateToken(req.user._id);
        // Set secure HTTP-only cookie with token (more secure than URL param)
        res.cookie('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Generate and set CSRF token
        const csrfToken = crypto.randomBytes(32).toString('hex');
        res.cookie('csrf_token', csrfToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        // Redirect to frontend (token in cookie, no sensitive data in URL)
        res.redirect(`${getFrontendUrl()}?oauth=success`);
      } catch (error) {
        console.error('OAuth callback error:', error);
        res.redirect(`${getFrontendUrl()}?error=oauth_failed`);
      }
    }
  );
} else {
  router.get('/github', (req, res) => {
    res.status(503).json({ error: 'GitHub OAuth is not configured' });
  });
  router.get('/github/callback', (req, res) => {
    res.redirect(`${getFrontendUrl()}?error=oauth_failed`);
  });
}

export default router;

