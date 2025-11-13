import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate as authenticateToken } from '../middleware/auth';
import { csrfProtect as validateCsrfToken } from '../middleware/csrf';
import User from '../models/User';
import Chat from '../models/Chat';
import { GeminiService } from '../services/geminiService';

interface AuthenticatedRequest {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  body: any;
  params: any;
  query: any;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
  set: (header: string, value: string) => void;
}

const geminiService = new GeminiService();

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  res: ExpressResponse
) => Promise<void>;

const router = express.Router();

// Message limit constants
const DAILY_MESSAGE_LIMIT = 20;
const MESSAGE_LENGTH_LIMIT = 10000;

// Memory cache for clientMessageId deduplication
const processedMessageIds = new Map<string, string>(); // clientMessageId -> threadId

// Utility to check user's daily message count
async function checkMessageLimit(userId: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const messageCount = await Chat.countDocuments({
    userId,
    createdAt: { $gte: today }
  });
  
  return messageCount >= DAILY_MESSAGE_LIMIT;
}

// Get remaining message count
async function getRemainingMessages(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const messageCount = await Chat.countDocuments({
    userId,
    createdAt: { $gte: today }
  });
  
  return Math.max(0, DAILY_MESSAGE_LIMIT - messageCount);
}

// Auto-generate title from first message
async function generateTitle(message: string): Promise<string> {
  try {
    const prompt = `Generate a short, descriptive title (max 6 words) for this conversation based on: "${message}"`;
    const titleResponse = await geminiService.generateText(prompt);
    return titleResponse.trim() || 'New Conversation';
  } catch (err) {
    console.error('Title generation failed:', err);
    return 'New Conversation';
  }
}

// Chat routes
router.post('/message', authenticateToken, validateCsrfToken, async (req: AuthenticatedRequest, res: ApiResponse) => {
  try {
    const { text, threadId, clientMessageId = uuidv4() } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: {
          title: 'Authentication required.',
          what: 'User is not authenticated.',
          action: 'Please sign in.',
          code: 'AUTH_REQUIRED'
        }
      });
    }

    // Validate input
    if (!text?.trim()) {
      return res.status(400).json({
        error: {
          title: 'Invalid input — message is empty.',
          what: 'No message content provided.',
          action: 'Please enter a message.',
          code: 'INVALID_INPUT'
        }
      });
    }

    if (text.length > MESSAGE_LENGTH_LIMIT) {
      return res.status(400).json({
        error: {
          title: 'Message too long — split and retry.',
          what: 'Message exceeds maximum length.',
          action: 'Split your message into smaller parts.',
          code: 'MESSAGE_TOO_LONG'
        }
      });
    }

    // Check for duplicate message
    if (processedMessageIds.has(clientMessageId)) {
      return res.status(409).json({
        error: {
          title: 'Duplicate message blocked.',
          what: 'This exact message was already sent.',
          action: 'Modify your message or send a different one.',
          code: 'DUPLICATE_MESSAGE'
        }
      });
    }

    // Check daily message limit
    const remaining = await getRemainingMessages(userId);
    if (remaining <= 0) {
      return res.status(429).json({
        error: {
          title: 'Daily message limit reached (20).',
          what: 'You have reached your daily message limit.',
          action: 'Try again tomorrow or upgrade your plan.',
          code: 'DAILY_MESSAGE_LIMIT'
        }
      });
    }

    // Create or get thread
    let thread;
    if (threadId) {
      thread = await Chat.findById(threadId);
      if (!thread) {
        return res.status(404).json({
          error: {
            title: 'Thread not found.',
            what: 'The conversation thread does not exist.',
            action: 'Start a new conversation.',
            code: 'THREAD_NOT_FOUND'
          }
        });
      }
    } else {
      // New thread - generate title
      const title = await generateTitle(text);
      thread = new Chat({
        userId,
        title,
        messages: []
      });
    }

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    thread.messages.push(userMessage);

    // Generate AI response
    try {
      const aiResponse = await geminiService.generateText(text, { threadId: thread.id });
      
      const aiMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };
      
      thread.messages.push(aiMessage);
      await thread.save();

      // Cache clientMessageId
      processedMessageIds.set(clientMessageId, thread.id);

      // Set remaining count header
      res.set('X-DailyLimit-Remaining', String(remaining - 1));
      
      return res.json({
        threadId: thread.id,
        messages: [userMessage, aiMessage]
      });

    } catch (err) {
      // Try fallback model
      try {
        const fallbackResponse = await geminiService.generateTextWithFallback(text, { threadId: thread.id });
        
        const aiMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: fallbackResponse,
          timestamp: new Date().toISOString()
        };
        
        thread.messages.push(aiMessage);
        await thread.save();

        processedMessageIds.set(clientMessageId, thread.id);
        res.set('X-DailyLimit-Remaining', String(remaining - 1));
        
        return res.json({
          threadId: thread.id,
          messages: [userMessage, aiMessage]
        });

      } catch (fallbackErr) {
        return res.status(500).json({
          error: {
            title: 'AI service error — try again.',
            what: 'Both primary and fallback models failed.',
            action: 'Please try again in a few moments.',
            code: 'LLM_TIMEOUT'
          }
        });
      }
    }

  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: {
        title: 'Server error — something went wrong.',
        what: 'Unexpected server error occurred.',
        action: 'Please try again.',
        code: 'SERVER_ERROR'
      }
    });
  }
});

router.get('/threads', authenticateToken, validateCsrfToken, async (req: AuthenticatedRequest, res: ApiResponse) => {
  try {
    const threads = await Chat.find({ userId: req.user?.id })
      .sort({ updatedAt: -1 })
      .limit(100);
      
    return res.json({ threads });
  } catch (err) {
    return res.status(500).json({
      error: {
        title: 'Server error — something went wrong.',
        what: 'Could not fetch conversation history.',
        action: 'Please try again.',
        code: 'SERVER_ERROR'
      }
    });
  }
});

export default router;