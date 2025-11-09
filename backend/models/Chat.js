import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4()
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isStarred: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat',
    set: function(value) {
      // Ensure title is never empty or non-string
      return typeof value === 'string' && value.trim() ? value.trim() : 'New Chat';
    }
  },
  messages: [messageSchema],
  isStarred: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate title from first user message with improved handling
chatSchema.methods.generateTitle = async function() {
  if (this.title !== 'New Chat') {
    // Skip if we already have a custom title
    return;
  }

  const firstUserMessage = this.messages.find(m => m.role === 'user');
  if (!firstUserMessage) {
    this.title = 'New Chat';
    return;
  }

  try {
    let content = firstUserMessage.content;
    
    // Ensure content is a string and not empty
    if (typeof content !== 'string' || !content.trim()) {
      this.title = 'New Chat';
      return;
    }

    content = content.trim();

    // Take first 50 chars and find a good truncation point
    let title = content.substring(0, 50);
    
    // Try to break at sentence end first
    let breakPoint = Math.max(
      title.lastIndexOf('. '),
      title.lastIndexOf('? '),
      title.lastIndexOf('! ')
    );

    // If no sentence break, try breaking at last space
    if (breakPoint < 20) {
      breakPoint = title.lastIndexOf(' ');
    }

    // If we found a good break point, use it
    if (breakPoint >= 20) {
      title = title.substring(0, breakPoint);
    }

    // Add ellipsis if we truncated
    this.title = title + (content.length > title.length ? '...' : '');

  } catch (err) {
    console.error('Error generating title:', err);
    this.title = 'New Chat';
  }
};

export default mongoose.model('Chat', chatSchema);

