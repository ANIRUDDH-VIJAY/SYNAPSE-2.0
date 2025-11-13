# Synapse Chatbot - API Contract Documentation

Version: 1.0.0  
Last Updated: November 3, 2025

## Overview

This document defines the API endpoints and data contracts for the Synapse chatbot application. All endpoints expect and return JSON data unless otherwise specified.

## Base URL

```
Production: https://api.synapse.ai/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer {access_token}
```

---

## Endpoints

### 1. Authentication

#### POST `/auth/login`

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://api.synapse.ai/avatars/usr_abc123.jpg",
    "plan": "free",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "rt_xyz789..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "ok": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

---

#### POST `/auth/signup`

Create a new account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": null,
    "plan": "free",
    "createdAt": "2025-11-03T14:20:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "rt_xyz789..."
}
```

---

#### POST `/auth/logout`

Invalidate the current session.

**Request:** (No body required)

**Response (200 OK):**
```json
{
  "ok": true,
  "message": "Successfully logged out"
}
```

---

### 2. User Profile

#### GET `/user/profile`

Get current user profile.

**Response (200 OK):**
```json
{
  "ok": true,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://api.synapse.ai/avatars/usr_abc123.jpg",
    "plan": "pro",
    "createdAt": "2025-01-15T10:30:00Z",
    "usage": {
      "totalChats": 142,
      "messagesSent": 1847,
      "apiCalls": 2156
    }
  }
}
```

---

#### PUT `/user/profile`

Update user profile.

**Request:**
```json
{
  "name": "John Smith",
  "avatar": "https://api.synapse.ai/avatars/new-avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Smith",
    "avatar": "https://api.synapse.ai/avatars/new-avatar.jpg",
    "plan": "pro",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### 3. User Settings

#### GET `/user/settings`

Get user settings and preferences.

**Response (200 OK):**
```json
{
  "ok": true,
  "settings": {
    "theme": "dark",
    "model": "synapse-v1-text",
    "responseLength": "medium",
    "maxTokens": 512,
    "temperature": 0.7,
    "streamResponses": true,
    "codeHighlight": true,
    "autoSave": "30d",
    "sendWithEnter": true,
    "allowConversationOverride": true
  }
}
```

---

#### PUT `/user/settings`

Update user settings (accepts partial updates).

**Request:**
```json
{
  "theme": "light",
  "temperature": 0.8,
  "maxTokens": 1024,
  "streamResponses": false
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "settings": {
    "theme": "light",
    "model": "synapse-v1-text",
    "responseLength": "medium",
    "maxTokens": 1024,
    "temperature": 0.8,
    "streamResponses": false,
    "codeHighlight": true,
    "autoSave": "30d",
    "sendWithEnter": true,
    "allowConversationOverride": true
  }
}
```

---

### 4. Chat Threads

#### GET `/threads`

Get all chat threads for the current user.

**Query Parameters:**
- `filter` (optional): `all`, `starred`, `archived` (default: `all`)
- `limit` (optional): Number of threads to return (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "ok": true,
  "threads": [
    {
      "id": "thrd_xyz789",
      "title": "Exploring quantum computing",
      "preview": "What are the key principles of quantum...",
      "messageCount": 12,
      "starred": true,
      "archived": false,
      "createdAt": "2025-11-03T10:15:00Z",
      "updatedAt": "2025-11-03T14:30:00Z"
    },
    {
      "id": "thrd_abc456",
      "title": "React best practices",
      "preview": "Can you explain the latest React hooks...",
      "messageCount": 8,
      "starred": false,
      "archived": false,
      "createdAt": "2025-11-02T16:20:00Z",
      "updatedAt": "2025-11-02T17:45:00Z"
    }
  ],
  "pagination": {
    "total": 142,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

---

#### POST `/threads`

Create a new chat thread.

**Request:**
```json
{
  "title": "New conversation",
  "message": "Hello, can you help me with React?"
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "thread": {
    "id": "thrd_new123",
    "title": "New conversation",
    "preview": "Hello, can you help me with React?",
    "messageCount": 1,
    "starred": false,
    "archived": false,
    "createdAt": "2025-11-03T15:00:00Z",
    "updatedAt": "2025-11-03T15:00:00Z"
  }
}
```

---

#### GET `/threads/:threadId`

Get a specific thread with all messages.

**Response (200 OK):**
```json
{
  "ok": true,
  "thread": {
    "id": "thrd_xyz789",
    "title": "Exploring quantum computing",
    "starred": true,
    "archived": false,
    "createdAt": "2025-11-03T10:15:00Z",
    "updatedAt": "2025-11-03T14:30:00Z",
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "What are the key principles of quantum computing?",
        "timestamp": "2025-11-03T10:15:00Z"
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "Quantum computing is based on several key principles...",
        "timestamp": "2025-11-03T10:15:23Z"
      }
    ]
  }
}
```

---

#### DELETE `/threads/:threadId`

Delete a thread.

**Response (200 OK):**
```json
{
  "ok": true,
  "message": "Thread deleted successfully"
}
```

---

### 5. Thread Actions

#### POST `/threads/:threadId/star`

Star/favorite a thread.

**Request:**
```json
{
  "userId": "usr_abc123"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "thread": {
    "id": "thrd_xyz789",
    "starred": true
  }
}
```

---

#### DELETE `/threads/:threadId/star`

Unstar a thread.

**Response (200 OK):**
```json
{
  "ok": true,
  "thread": {
    "id": "thrd_xyz789",
    "starred": false
  }
}
```

---

#### POST `/threads/:threadId/archive`

Archive a thread.

**Response (200 OK):**
```json
{
  "ok": true,
  "thread": {
    "id": "thrd_xyz789",
    "archived": true
  }
}
```

---

#### DELETE `/threads/:threadId/archive`

Unarchive a thread.

**Response (200 OK):**
```json
{
  "ok": true,
  "thread": {
    "id": "thrd_xyz789",
    "archived": false
  }
}
```

---

### 6. Messages

#### POST `/threads/:threadId/messages`

Send a message in a thread.

**Request:**
```json
{
  "content": "Can you explain this concept in more detail?",
  "stream": true
}
```

**Response (Streaming enabled - SSE):**
```
data: {"type":"token","content":"Sure"}
data: {"type":"token","content":", I'd be"}
data: {"type":"token","content":" happy to"}
data: {"type":"done","messageId":"msg_003"}
```

**Response (Streaming disabled - 200 OK):**
```json
{
  "ok": true,
  "message": {
    "id": "msg_003",
    "role": "assistant",
    "content": "Sure, I'd be happy to explain...",
    "timestamp": "2025-11-03T15:30:00Z"
  }
}
```

---

#### POST `/threads/:threadId/messages/:messageId/star`

Star a specific message.

**Response (200 OK):**
```json
{
  "ok": true,
  "message": {
    "id": "msg_003",
    "starred": true
  }
}
```

---

### 7. Search

#### GET `/search`

Search across all threads and messages.

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 20)

**Response (200 OK):**
```json
{
  "ok": true,
  "results": [
    {
      "type": "thread",
      "thread": {
        "id": "thrd_xyz789",
        "title": "Exploring quantum computing",
        "preview": "What are the key principles of quantum...",
        "matchedContent": "...quantum <mark>computing</mark> is based on...",
        "updatedAt": "2025-11-03T14:30:00Z"
      }
    }
  ],
  "total": 15
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email or password is incorrect |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | User does not have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Free Plan:** 50 requests per minute
- **Pro Plan:** 200 requests per minute
- **Enterprise:** Custom limits

Rate limit headers:
```http
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1699027200
```

---

## Webhooks (Optional)

Configure webhooks for real-time updates:

**Event Types:**
- `thread.created`
- `thread.updated`
- `thread.deleted`
- `message.received`

**Webhook Payload:**
```json
{
  "event": "thread.created",
  "timestamp": "2025-11-03T15:00:00Z",
  "data": {
    "threadId": "thrd_new123",
    "userId": "usr_abc123"
  }
}
```

---

## Notes for Frontend Developers

1. **Loading States:** Always show loading states when making API calls
2. **Error Handling:** Display user-friendly error messages from the API
3. **Optimistic Updates:** Update UI immediately for star/archive actions, rollback on error
4. **Token Refresh:** Implement automatic token refresh using the `refreshToken`
5. **Streaming:** Use EventSource or fetch API with streaming support for real-time responses
6. **Debouncing:** Debounce search queries by at least 300ms
7. **Pagination:** Implement infinite scroll or pagination for thread lists
