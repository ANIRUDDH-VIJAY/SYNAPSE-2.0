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
import passport from './config/passport.js';


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow OAuth redirects
}));
// CORS configuration - strict in production, permissive in development
const allowedOrigins = [
  process.env.FRONTEND_URL
].filter(Boolean); // Only FRONTEND_URL - no hardcoded origins

app.use(cors({
  origin: (origin, callback) => {
    // In production, be strict about origins
    if (process.env.NODE_ENV === 'production') {
      if (!origin) {
        // In production, reject requests with no origin for security
        return callback(new Error('CORS: Origin required in production'));
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // Development: more permissive
      if (!origin) {
        // Allow no-origin requests in dev (for tools like Postman)
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        // Allow any localhost in development
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true, // Required for cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Client-Message-Id', 'X-Retry-With-Fallback'], // Allow custom headers
  exposedHeaders: ['Content-Type']
}));
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
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent XSS
      sameSite: 'lax', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    },
    // TODO: In production, use persistent store:
    // store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// CSRF protection middleware
import { csrfProtect } from './middleware/csrf.js';

// Routes (import and use below)
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';
import feedbackRoutes from './routes/feedback.js';

// Apply CSRF protection to all state-changing routes
app.use('/auth', authRoutes);
app.use('/chat', csrfProtect, chatRoutes);
app.use('/admin', csrfProtect, adminRoutes);
app.use('/feedback', csrfProtect, feedbackRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

