import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from '../config/passport.js';
import { csrfProtect } from '../middleware/csrf.js';

// Routes
import authRoutes from '../routes/auth.js';
import chatRoutes from '../routes/chat.js';
import adminRoutes from '../routes/admin.js';
import feedbackRoutes from '../routes/feedback.js';

const app = express();
app.set('trust proxy', 1); // *** REQUIRED for secure cookies on Render ***

const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow OAuth redirects
}));

// Resolve frontend/backend URLs (support VITE_ fallbacks so existing env names don't need changing)
const resolvedFrontendUrl =
  process.env.FRONTEND_URL ||
  process.env.VITE_FRONTEND_URL ||
  "https://synapse-2-0.vercel.app"; // fallback for production deploy
const resolvedBackendUrl = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL;

if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: [
      resolvedFrontendUrl,              // the real frontend
      "http://localhost:5173",          // dev fallback
      "http://127.0.0.1:5173"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Client-Message-Id',
      'X-Retry-With-Fallback'
    ],
    exposedHeaders: ['Content-Type']
  }));
} else {
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) return callback(null, true);
      // allow explicit FRONTEND_URL or VITE_FRONTEND_URL in dev if provided
      if (resolvedFrontendUrl && origin === resolvedFrontendUrl) return callback(null, true);
      return callback(null, true); // permissive for dev
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Client-Message-Id', 'X-Retry-With-Fallback'],
    exposedHeaders: ['Content-Type']
  }));
}

app.use(morgan('dev'));
app.use(cookieParser()); // Parse cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration for OAuth
// Note: For production, consider using connect-mongo or Redis for session storage
app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'change-this-in-production',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Trust the reverse proxy
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent XSS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection: none in prod for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // Allow explicit cookie domain override via COOKIE_DOMAIN, otherwise derive from BACKEND_URL (or VITE_BACKEND_URL) in prod
      domain: process.env.COOKIE_DOMAIN || (process.env.NODE_ENV === 'production' && (process.env.BACKEND_URL || process.env.VITE_BACKEND_URL) ? new URL(process.env.BACKEND_URL || process.env.VITE_BACKEND_URL).hostname : undefined)
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// MongoDB connection with retry
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    // Optionally use in-memory MongoDB for local testing when USE_MEMORY_DB=true
    if (!mongoUri || process.env.USE_MEMORY_DB === 'true') {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const ms = await MongoMemoryServer.create();
        mongoUri = ms.getUri();
        console.log('ℹ️  Using in-memory MongoDB for dev/testing at', mongoUri);
      } catch (e) {
        console.warn('⚠️  Failed to start in-memory MongoDB:', e?.message || e);
      }
    }

    if (!mongoUri) throw new Error('No MongoDB URI configured');

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Issue CSRF token cookie
app.get('/auth/csrf', (req, res) => {
  const token = Math.random().toString(36).substring(2);
  res.cookie('csrf_token', token, {
    httpOnly: false, // allow frontend JS to read it
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ csrf: token });
});

// Apply CSRF protection to all state-changing routes
app.use('/auth', authRoutes);
app.use('/chat', csrfProtect, chatRoutes);
app.use('/admin', csrfProtect, adminRoutes);
app.use('/feedback', csrfProtect, feedbackRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Diagnostic endpoint: returns resolved callback URLs, backend/frontend and cookie domain
app.get('/auth/callbacks', (req, res) => {
  try {
    const resolvedGoogleCallback = process.env.GOOGLE_CALLBACK_URL || `${resolvedBackendUrl || 'http://localhost:4000'}/auth/google/callback`;
    const resolvedGithubCallback = process.env.GITHUB_CALLBACK_URL || `${resolvedBackendUrl || 'http://localhost:4000'}/auth/github/callback`;
    const cookieDomain = process.env.COOKIE_DOMAIN || (process.env.NODE_ENV === 'production' && (process.env.BACKEND_URL || process.env.VITE_BACKEND_URL) ? new URL(process.env.BACKEND_URL || process.env.VITE_BACKEND_URL).hostname : undefined);

    return res.json({
      ok: true,
      resolvedBackendUrl: resolvedBackendUrl || null,
      resolvedFrontendUrl: resolvedFrontendUrl || null,
      googleCallback: resolvedGoogleCallback,
      githubCallback: resolvedGithubCallback,
      cookieDomain: cookieDomain || null
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// DB test endpoint - useful for verifying DB connectivity in local/dev
app.get('/db-test', async (req, res) => {
  try {
    if (!mongoose.connection || !mongoose.connection.db) {
      return res.status(500).json({ ok: false, error: 'MongoDB not connected' });
    }
    const col = mongoose.connection.db.collection('synapse_test');
    const result = await col.insertOne({ createdAt: new Date(), note: 'hello from db-test' });
    const inserted = await col.findOne({ _id: result.insertedId });
    return res.json({ ok: true, inserted });
  } catch (e) {
    console.error('db-test error', e);
    return res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message).join(', ') || err.message;
    return res.status(400).json({ error: messages });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(400).json({ error: `${field} already exists` });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Print resolved runtime values for easier debugging in deployed environments
const resolvedGoogleCallback = process.env.GOOGLE_CALLBACK_URL || `${resolvedBackendUrl || 'http://localhost:4000'}/auth/google/callback`;
const resolvedGithubCallback = process.env.GITHUB_CALLBACK_URL || `${resolvedBackendUrl || 'http://localhost:4000'}/auth/github/callback`;
const cookieDomain = process.env.COOKIE_DOMAIN || (process.env.NODE_ENV === 'production' && (process.env.BACKEND_URL || process.env.VITE_BACKEND_URL) ? new URL(process.env.BACKEND_URL || process.env.VITE_BACKEND_URL).hostname : undefined);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.info('Runtime values:');
  console.info('  resolvedBackendUrl:', resolvedBackendUrl || 'not set (falls back to localhost)');
  console.info('  resolvedFrontendUrl:', resolvedFrontendUrl || 'not set (falls back to localhost dev)');
  console.info('  googleCallback:', resolvedGoogleCallback);
  console.info('  githubCallback:', resolvedGithubCallback);
  console.info('  cookieDomain:', cookieDomain || 'not set (host-only cookie)');
});