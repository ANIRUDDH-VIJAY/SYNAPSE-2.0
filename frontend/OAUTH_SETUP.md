# 🔐 OAuth Setup Guide - Google & GitHub

## Backend Configuration

### 1. Update `backend/.env`

Add these OAuth variables:

```env
# OAuth Callback URLs (should point to backend)
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Session Secret (for OAuth sessions)
SESSION_SECRET=your-session-secret-key
```

## Getting OAuth Credentials

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   ```
   http://localhost:4000/auth/google/callback
   ```
7. Copy **Client ID** and **Client Secret**

### GitHub OAuth Setup

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Synapse AI
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:4000/auth/github/callback`
4. Click **Register application**
5. Copy **Client ID** and generate **Client Secret**

## Frontend Configuration

### Update `.env` (root directory)

```env
VITE_APP_NAME=Synapse
VITE_BACKEND_URL=http://localhost:4000
```

The frontend doesn't need OAuth credentials - it just redirects to backend OAuth endpoints.

## How It Works

1. **User clicks "Continue with Google/GitHub"**
   - Frontend redirects to: `http://localhost:4000/auth/google` or `/auth/github`

2. **Backend initiates OAuth flow**
   - Redirects user to Google/GitHub login page

3. **User authorizes**
   - Google/GitHub redirects back to: `http://localhost:4000/auth/google/callback`

4. **Backend processes callback**
   - Creates/finds user in database
   - Generates JWT token
   - Redirects to frontend with token: `http://localhost:5173?token=...&user=...`

5. **Frontend handles callback**
   - Extracts token from URL
   - Saves to localStorage
   - Logs user in

## Testing

1. **Start backend:**
   ```bash
   cd backend
   npm install  # Install new OAuth packages
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

3. **Test OAuth:**
   - Open http://localhost:5173
   - Click "Login / Sign Up"
   - Click "Continue with Google" or "Continue with GitHub"
   - Complete OAuth flow
   - Should redirect back and log you in

## Troubleshooting

### "Invalid redirect URI"
- Check callback URLs match exactly in OAuth provider settings
- Ensure callback URL points to backend (port 4000), not frontend

### "OAuth error" after redirect
- Check backend console for errors
- Verify OAuth credentials in `.env` are correct
- Ensure MongoDB is connected

### Session errors
- Make sure `SESSION_SECRET` is set in `backend/.env`
- Can use same value as `JWT_SECRET` for development

## Production Notes

For production, update:
- Callback URLs to your production domain
- `FRONTEND_URL` to production frontend URL
- Use secure session cookies (`secure: true` in production)


