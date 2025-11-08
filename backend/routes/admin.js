import express from 'express';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// GET /admin/users - Get all users (for admin monitoring)
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('name email createdAt oauthProvider')
      .sort({ createdAt: -1 })
      .lean();

    const userList = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      authMethod: user.oauthProvider || 'email'
    }));

    res.json(userList);
  } catch (error) {
    next(error);
  }
});

// GET /admin/users/count - Get total user count
router.get('/users/count', async (req, res, next) => {
  try {
    const count = await User.countDocuments({});
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// GET /admin/feedback - Get all feedback (admin only)
router.get('/feedback', async (req, res, next) => {
  try {
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .lean();

    res.json(feedback);
  } catch (error) {
    next(error);
  }
});

export default router;

