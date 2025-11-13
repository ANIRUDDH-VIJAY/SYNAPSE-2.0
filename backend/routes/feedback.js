import express from 'express';
import Feedback from '../models/Feedback.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// POST /feedback - Submit feedback
router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      message: message.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    next(error);
  }
});

export default router;

