# Environment Variables Configuration

## Backend `.env` (backend/.env)

```env
PORT=4000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-session-secret-key

# OAuth Callback URLs (point to backend)
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

GEMINI_API_KEY=your-gemini-api-key
```

**Important Notes:**
- `GOOGLE_CALLBACK_URL` and `GITHUB_CALLBACK_URL` should point to **backend** (port 4000), not frontend
- These are the URLs that OAuth providers (Google/GitHub) will redirect to after authentication
- The backend then redirects to the frontend with the token

## Frontend `.env` (root directory)

```env
VITE_APP_NAME=Synapse
VITE_BACKEND_URL=http://localhost:4000
```

**Note:** 
- `VITE_OAUTH_CALLBACK` is **NOT needed** in frontend `.env`
- The frontend doesn't need to know about OAuth callback URLs
- OAuth flow: Frontend → Backend → OAuth Provider → Backend → Frontend

## OAuth Flow Explanation

1. User clicks "Continue with Google/GitHub" on frontend
2. Frontend redirects to: `http://localhost:4000/auth/google` (backend)
3. Backend redirects to Google/GitHub OAuth page
4. User authorizes on OAuth provider
5. OAuth provider redirects to: `http://localhost:4000/auth/google/callback` (backend callback URL)
6. Backend processes callback, creates JWT token
7. Backend redirects to: `http://localhost:5173?token=...&user=...` (frontend with token)
8. Frontend extracts token from URL and logs user in

## Setting Up OAuth Providers

### Google OAuth
- **Authorized redirect URI in Google Console:** `http://localhost:4000/auth/google/callback`
- This must match `GOOGLE_CALLBACK_URL` in backend `.env`

### GitHub OAuth  
- **Authorization callback URL in GitHub:** `http://localhost:4000/auth/github/callback`
- This must match `GITHUB_CALLBACK_URL` in backend `.env`


