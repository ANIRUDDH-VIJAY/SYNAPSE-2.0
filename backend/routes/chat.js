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

// POST /chat/message/stream
// Provides a streaming-friendly response (SSE-style lines) so clients that
// expect server-sent chunks can consume partial tokens. For now we send a
// single 'token' chunk containing the full response followed by a 'done'
// event to remain compatible with clients that parse 'data: {...}' lines.
router.post('/message/stream', async (req, res, next) => {
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
      console.error('Gemini API Error (stream):', error);

      if (String(error.message).includes('429')) {
        return res.status(503).json({ error: 'AI temporarily overloaded. Please try again in a few seconds.' });
      }

      if (String(error.message).includes('safety') || String(error.message).includes('blocked')) {
        return res.status(400).json({ error: 'Message was blocked by safety filters. Please rephrase your message.' });
      }
      if (String(error.message).includes('key')) {
        return res.status(500).json({ error: 'API key error. Please check server configuration.' });
      }

      return res.status(500).json({ 
        error: 'AI service encountered an error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // Append assistant message to chat and persist
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

    // Send SSE-like chunks. We return a simple streaming payload compatible
    // with the frontend's parser: lines that start with 'data: ' followed by
    // a JSON payload. Here we send one token chunk with the full content,
    // then a done event. Clients can easily adapt to more granular tokens
    // if an upstream streaming integration is later implemented.
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (res.flushHeaders) res.flushHeaders();

    const sendData = (obj) => {
      try {
        res.write(`data: ${JSON.stringify(obj)}\n\n`);
      } catch (e) {
        console.error('Error writing stream chunk:', e);
      }
    };

    // Stream the assistant response word-by-word with better token handling
    const normalizeContent = (text) => {
      if (typeof text !== 'string') {
        try {
          return JSON.stringify(text);
        } catch (e) {
          return String(text || '');
        }
      }
      return text;
    };

    const aiContent = normalizeContent(aiResponse);
    const words = aiContent.split(/(\s+)/); // Split on spaces but keep the spaces
    const chunkSize = 3; // Send 3 words at a time for smoother streaming

    // Send chunks of words with preserved spacing
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join('');
      if (chunk) {
        sendData({ type: 'token', content: chunk });
        // Small delay between chunks for smooth streaming
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    }

    // Signal completion
    sendData({ type: 'done' });

    // Ensure final line feed and end response
    res.write('\n');
    res.end();
  } catch (error) {
    next(error);
  }
});


// GET /chat/history
router.get('/history', async (req, res, next) => {
  try {
    // Validate user ID to prevent potential errors
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Fetch chats with proper error handling
    let chats;
    try {
      chats = await Chat.find({ userId: req.user._id })
        .select('_id title isStarred createdAt updatedAt messages')
        .sort({ updatedAt: -1 })
        .lean()
        .exec();
    } catch (dbError) {
      console.error('Database error fetching chats:', dbError);
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    // Ensure we have an array to work with
    if (!Array.isArray(chats)) {
      console.warn('Chat.find returned non-array:', chats);
      chats = [];
    }

    // Map chats with validation for each field
    const chatList = chats.map(chat => {
      // Ensure chat object is valid
      if (!chat || typeof chat !== 'object') {
        console.warn('Invalid chat object in results:', chat);
        return null;
      }

      return {
        id: String(chat._id), // Ensure ID is string
        title: typeof chat.title === 'string' ? chat.title : 'New Chat',
        isStarred: Boolean(chat.isStarred), // Normalize to boolean
        createdAt: chat.createdAt instanceof Date ? chat.createdAt : new Date(),
        updatedAt: chat.updatedAt instanceof Date ? chat.updatedAt : new Date(),
        messageCount: Array.isArray(chat.messages) ? chat.messages.length : 0
      };
    }).filter(chat => chat !== null); // Remove any invalid entries

    // Return empty array if no valid chats found
    res.json(chatList);
  } catch (error) {
    console.error('Unexpected error in chat history:', error);
    res.status(500).json({ 
      error: 'Failed to process chat history',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
