import express from 'express';
import Chat from '../models/Chat.js';
import { authenticate } from '../middleware/auth.js';
import getGeminiAPIResponse from '../services/geminiService.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// POST /chat/create
router.post('/create', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id,
      messages: []
    });

    res.status(201).json({
      chatId: chat._id,
      createdAt: chat.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// POST /chat/message
router.post('/message', async (req, res, next) => {
  try {
    const { chatId, text, clientMessageId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    let chat;
    if (chatId) {
      chat = await Chat.findOne({
        _id: chatId,
        userId: req.user._id
      });
    }
    
    if (!chat) {
      // Create a new chat if none exists
      chat = await Chat.create({
        userId: req.user._id,
        messages: []
      });
    }

    chat.messages.push({
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    });

    await chat.save();

    let aiResponse;
    try {
      aiResponse = await getGeminiAPIResponse(chat.messages);
    } catch (error) {
      console.error('Gemini API Error:', error);

      if (String(error.message).includes('429')) {
        return res.status(503).json({ error: 'AI temporarily overloaded. Please try again in a few seconds.' });
      }

      if (String(error.message).includes('safety') || String(error.message).includes('blocked')) {
        return res.status(400).json({ error: 'Message was blocked by safety filters. Please rephrase your message.' });
      }
      
      if (String(error.message).includes('key')) {
        return res.status(500).json({ error: 'API key error. Please check server configuration.' });
      }
      
      console.error('Gemini API Error:', error);
      return res.status(500).json({ 
        error: 'AI service encountered an error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    if (!chat.title) {
      chat.generateTitle();
    }

    chat.updatedAt = new Date();
    await chat.save();

    const cleanedMessages = chat.messages.map(m => ({
      id: m.id,
      role: m.role,
      content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
      timestamp: m.timestamp ? new Date(m.timestamp).toISOString() : null
    }));

    return res.json({
      messages: cleanedMessages,
      title: chat.title || ''
    });

  } catch (error) {
    next(error);
  }
});


// GET /chat/history
router.get('/history', async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('_id title isStarred createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .lean();

    const chatList = chats.map(chat => ({
      id: chat._id,
      title: chat.title || 'New Chat',
      isStarred: chat.isStarred,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length
    }));

    res.json(chatList);
  } catch (error) {
    next(error);
  }
});

// DELETE /chat/clear (must be before /:id)
router.delete('/clear', async (req, res, next) => {
  try {
    const result = await Chat.deleteMany({ userId: req.user._id });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    next(error);
  }
});

// GET /chat/:id
router.get('/:id', async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    next(error);
  }
});

// PATCH /chat/:id/star
router.patch('/:id/star', async (req, res, next) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chat.isStarred = !chat.isStarred;
    await chat.save();

    res.json({ id: chat._id, isStarred: chat.isStarred });
  } catch (error) {
    next(error);
  }
});

// DELETE /chat/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Chat.deleteOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
