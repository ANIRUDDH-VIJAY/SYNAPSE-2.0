# API Endpoints Specification

Backend API contract for Synapse UI integration.

---

## 📋 Base Configuration

```
Base URL: https://your-api.com/api
Authentication: Bearer Token (JWT)
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### POST `/auth/signup`

Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-11-05T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Email already exists"
}

// 422 Unprocessable Entity
{
  "error": "Validation failed",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

---

### POST `/auth/login`

Authenticate existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Invalid credentials"
}

// 429 Too Many Requests
{
  "error": "Too many login attempts. Please try again later."
}
```

---

### GET `/auth/verify`

Verify token validity and get user info.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cdn.example.com/avatars/user_123.jpg"
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Invalid or expired token"
}
```

---

### POST `/auth/logout`

Invalidate current token (optional if using stateless JWT).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 💬 Chat Endpoints

### GET `/chats`

Get all chats for authenticated user.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?limit=50          # Optional: Limit results (default: 50)
?offset=0          # Optional: Pagination offset
?search=query      # Optional: Search chat titles
```

**Response (200 OK):**
```json
{
  "chats": [
    {
      "id": "chat_abc123",
      "title": "How do LLMs work?",
      "preview": "How do LLMs work in general",
      "isStarred": true,
      "createdAt": "2024-11-05T10:30:00Z",
      "updatedAt": "2024-11-05T14:20:00Z",
      "messageCount": 12
    },
    {
      "id": "chat_def456",
      "title": "Quantum Computing",
      "preview": "Explain quantum computing basics",
      "isStarred": false,
      "createdAt": "2024-11-04T09:15:00Z",
      "updatedAt": "2024-11-04T09:45:00Z",
      "messageCount": 8
    }
  ],
  "total": 127,
  "hasMore": true
}
```

**UI Mapping:**
```typescript
// Transform to UI format
const uiChats = chats.map(chat => ({
  id: chat.id,
  text: chat.preview || chat.title,
  time: formatRelativeTime(chat.updatedAt),
  isStarred: chat.isStarred
}));
```

---

### POST `/chats`

Create a new chat.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "New Chat",         // Optional
  "initialMessage": "Hello!"   // Optional
}
```

**Response (201 Created):**
```json
{
  "chat": {
    "id": "chat_xyz789",
    "title": "New Chat",
    "preview": "",
    "isStarred": false,
    "createdAt": "2024-11-05T15:00:00Z",
    "updatedAt": "2024-11-05T15:00:00Z",
    "messageCount": 0
  }
}
```

---

### GET `/chats/:chatId`

Get specific chat details.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "chat": {
    "id": "chat_abc123",
    "title": "How do LLMs work?",
    "preview": "How do LLMs work in general",
    "isStarred": true,
    "createdAt": "2024-11-05T10:30:00Z",
    "updatedAt": "2024-11-05T14:20:00Z",
    "messageCount": 12
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Chat not found"
}

// 403 Forbidden
{
  "error": "You don't have access to this chat"
}
```

---

### PATCH `/chats/:chatId`

Update chat properties.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "title": "Updated Title"     // Optional
}
```

**Response (200 OK):**
```json
{
  "chat": {
    "id": "chat_abc123",
    "title": "Updated Title",
    "preview": "How do LLMs work in general",
    "isStarred": true,
    "createdAt": "2024-11-05T10:30:00Z",
    "updatedAt": "2024-11-05T16:00:00Z",
    "messageCount": 12
  }
}
```

---

### PATCH `/chats/:chatId/star`

Toggle chat star status.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "isStarred": true   // Optional: if not provided, toggle current state
}
```

**Response (200 OK):**
```json
{
  "chat": {
    "id": "chat_abc123",
    "isStarred": true
  }
}
```

---

### DELETE `/chats/:chatId`

Delete a chat and all its messages.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Chat not found"
}

// 403 Forbidden
{
  "error": "You don't have permission to delete this chat"
}
```

---

## 📨 Message Endpoints

### GET `/chats/:chatId/messages`

Get all messages in a chat.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?limit=100         # Optional: Limit results (default: 100)
?before=msg_id     # Optional: Get messages before this ID
?after=msg_id      # Optional: Get messages after this ID
```

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "How do LLMs work?",
      "createdAt": "2024-11-05T10:30:00Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "Large Language Models (LLMs) are...",
      "createdAt": "2024-11-05T10:30:15Z",
      "model": "synapse-v1"
    }
  ],
  "hasMore": false
}
```

**UI Mapping:**
```typescript
// Transform to UI format
const uiMessages = messages.map(msg => ({
  id: msg.id,
  role: msg.role,
  content: msg.content,
  timestamp: formatTime(msg.createdAt)
}));
```

---

### POST `/chats/:chatId/messages`

Send a new message (non-streaming).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "content": "Explain quantum computing",
  "context": {                    // Optional
    "previousMessages": 5,        // Number of previous messages to include
    "temperature": 0.7            // Model temperature
  }
}
```

**Response (200 OK):**
```json
{
  "message": {
    "id": "msg_003",
    "role": "assistant",
    "content": "Quantum computing is a type of computation that...",
    "createdAt": "2024-11-05T11:00:00Z",
    "model": "synapse-v1",
    "usage": {
      "promptTokens": 150,
      "completionTokens": 300,
      "totalTokens": 450
    }
  }
}
```

---

### POST `/chats/:chatId/messages/stream`

Send message with streaming response (SSE).

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: text/event-stream
```

**Request:**
```json
{
  "content": "Write a story about AI",
  "stream": true
}
```

**Response (200 OK - text/event-stream):**
```
data: {"type": "start", "messageId": "msg_004"}

data: {"type": "chunk", "content": "Once"}

data: {"type": "chunk", "content": " upon"}

data: {"type": "chunk", "content": " a"}

data: {"type": "chunk", "content": " time"}

data: {"type": "end", "messageId": "msg_004", "usage": {...}}
```

**Client Implementation:**
```typescript
const response = await fetch('/api/chats/chat_123/messages/stream', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: message, stream: true })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      
      if (data.type === 'chunk') {
        // Append chunk to message
        updateMessage(data.content);
      }
    }
  }
}
```

---

### DELETE `/messages/:messageId`

Delete a specific message.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content)**

**Error Responses:**
```json
// 404 Not Found
{
  "error": "Message not found"
}

// 403 Forbidden
{
  "error": "Cannot delete assistant messages"
}
```

---

## 👤 User Endpoints

### GET `/user/profile`

Get current user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cdn.example.com/avatars/user_123.jpg",
    "plan": "free",
    "createdAt": "2024-10-01T00:00:00Z",
    "stats": {
      "totalChats": 127,
      "totalMessages": 2543
    }
  }
}
```

---

### PATCH `/user/profile`

Update user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "John Smith",           // Optional
  "avatar": "base64_image_data"   // Optional
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_123",
    "name": "John Smith",
    "email": "john@example.com",
    "avatar": "https://cdn.example.com/avatars/user_123.jpg",
    "updatedAt": "2024-11-05T12:00:00Z"
  }
}
```

---

### GET `/user/settings`

Get user settings/preferences.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "settings": {
    "theme": "dark",
    "model": "synapse-v1",
    "responseLength": 50,
    "creativity": 50,
    "codeHighlighting": true,
    "autoSave": true,
    "sendWithEnter": true
  }
}
```

---

### PATCH `/user/settings`

Update user settings.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "theme": "light",
  "creativity": 75
}
```

**Response (200 OK):**
```json
{
  "settings": {
    "theme": "light",
    "model": "synapse-v1",
    "responseLength": 50,
    "creativity": 75,
    "codeHighlighting": true,
    "autoSave": true,
    "sendWithEnter": true
  }
}
```

---

## 🔍 Search Endpoint

### GET `/search`

Search across chats and messages.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?q=quantum          # Required: Search query
?limit=20           # Optional: Results limit
?type=all           # Optional: 'chats', 'messages', or 'all'
```

**Response (200 OK):**
```json
{
  "results": {
    "chats": [
      {
        "id": "chat_abc123",
        "title": "Quantum Computing",
        "preview": "Explain quantum computing basics",
        "relevance": 0.95
      }
    ],
    "messages": [
      {
        "id": "msg_004",
        "chatId": "chat_abc123",
        "content": "Quantum computing is...",
        "role": "assistant",
        "relevance": 0.87
      }
    ]
  },
  "total": 12
}
```

---

## ⚡ Real-time Endpoints (Optional)

### WebSocket `/ws`

Real-time updates for chats and messages.

**Connection:**
```javascript
const ws = new WebSocket('wss://your-api.com/ws?token=YOUR_JWT_TOKEN');
```

**Client → Server Messages:**
```json
// Subscribe to chat updates
{
  "type": "subscribe",
  "chatId": "chat_abc123"
}

// Unsubscribe
{
  "type": "unsubscribe",
  "chatId": "chat_abc123"
}

// Heartbeat
{
  "type": "ping"
}
```

**Server → Client Messages:**
```json
// New message
{
  "type": "message",
  "chatId": "chat_abc123",
  "message": {
    "id": "msg_005",
    "role": "assistant",
    "content": "Response text..."
  }
}

// Chat updated
{
  "type": "chat_updated",
  "chat": {
    "id": "chat_abc123",
    "title": "New Title"
  }
}

// Typing indicator
{
  "type": "typing",
  "chatId": "chat_abc123",
  "isTyping": true
}

// Heartbeat response
{
  "type": "pong"
}
```

---

## 🔔 Error Response Format

All errors follow this consistent format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",           // Optional: Machine-readable code
  "details": {                     // Optional: Additional details
    "field": "Specific field error"
  }
}
```

### Common Error Codes

| Status | Code | Meaning |
|--------|------|---------|
| 400 | BAD_REQUEST | Invalid request format |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource conflict (e.g., duplicate) |
| 422 | VALIDATION_ERROR | Input validation failed |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily down |

---

## 📊 Rate Limiting

**Recommended Limits:**

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 requests | 15 minutes |
| POST /auth/signup | 3 requests | 1 hour |
| POST /chats/:id/messages | 60 requests | 1 minute |
| GET /chats | 100 requests | 1 minute |
| Other endpoints | 1000 requests | 1 hour |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1699200000
```

---

## 🔒 Security Headers

**Required Response Headers:**

```
Access-Control-Allow-Origin: https://your-frontend.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 📝 Implementation Checklist

Backend implementation checklist:

- [ ] Authentication endpoints (signup, login, verify)
- [ ] JWT token generation and validation
- [ ] Chat CRUD operations
- [ ] Message endpoints (get, send)
- [ ] Streaming response support (SSE or WebSocket)
- [ ] User profile endpoints
- [ ] Settings endpoints
- [ ] Search functionality
- [ ] Star/unstar functionality
- [ ] Pagination support
- [ ] Error handling
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Security headers
- [ ] Input validation
- [ ] Database indexes
- [ ] Logging and monitoring

---

**API designed for optimal frontend integration!** 🚀
