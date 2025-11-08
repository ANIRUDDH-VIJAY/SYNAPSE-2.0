# Environment Variables - Correct Configuration

## ✅ Correct Backend `.env` (backend/.env)

```env
PORT=4000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret-key

# OAuth Callback URLs (MUST point to backend port 4000)
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

GEMINI_API_KEY=your-gemini-api-key
```

## ✅ Correct Frontend `.env` (root directory)

```env
VITE_APP_NAME=Synapse
VITE_BACKEND_URL=http://localhost:4000
```

**❌ DO NOT include `VITE_OAUTH_CALLBACK` in frontend `.env`**
- The frontend doesn't need to know about OAuth callback URLs
- OAuth callbacks go to the backend, which then redirects to the frontend

## Why Callback URLs Point to Backend

The OAuth flow works like this:

1. **User clicks OAuth button** → Frontend redirects to `http://localhost:4000/auth/google`
2. **Backend initiates OAuth** → Redirects to Google/GitHub
3. **User authorizes** → Google/GitHub redirects to **backend callback**: `http://localhost:4000/auth/google/callback`
4. **Backend processes** → Creates user, generates JWT token
5. **Backend redirects to frontend** → `http://localhost:5173?token=...&user=...`
6. **Frontend handles token** → Extracts from URL, saves to localStorage

The callback URL must be the **backend** because:
- The backend needs to process the OAuth response
- The backend generates the JWT token
- The backend then redirects to the frontend with the token

## UI Preservation

✅ **Original UI is preserved:**
- Email/password forms work exactly as before
- OAuth buttons are **additions** that don't replace anything
- All original styling and functionality remains intact
- OAuth buttons use the same design system (outline buttons, matching colors)

The OAuth buttons are optional enhancements that fit seamlessly into the existing design.


