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
    default: null
  },
  messages: [messageSchema],
  isStarred: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate title from first user message
chatSchema.methods.generateTitle = async function() {
  const firstUserMessage = this.messages.find(m => m.role === 'user');
  if (firstUserMessage && !this.title) {
    try {
      // Take first 50 chars, truncate at last space
      let title = firstUserMessage.content;
      if (typeof title === 'string') {
        title = title.substring(0, 50);
        const lastSpace = title.lastIndexOf(' ');
        if (lastSpace > 20) {
          title = title.substring(0, lastSpace);
        }
        this.title = title + (firstUserMessage.content.length > 50 ? '...' : '');
      } else {
        this.title = 'New Chat';
      }
    } catch (err) {
      console.error('Error generating title:', err);
      this.title = 'New Chat';
    }
  }
};

export default mongoose.model('Chat', chatSchema);

