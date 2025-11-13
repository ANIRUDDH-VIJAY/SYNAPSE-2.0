# 🚀 Deployment Guide

This guide walks you through deploying Synapse 2.0 to **Vercel** (frontend) and **Render** (backend).

---

## 📋 Prerequisites

- GitHub account with the repository pushed
- Vercel account
- Render account
- MongoDB Atlas account (free tier available)
- All API keys ready (Gemini, Google OAuth, GitHub OAuth)

---

## 1️⃣ Backend Deployment (Render)

### Step 1: Create Render Account & Connect GitHub

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Grant Render access to your repositories

### Step 2: Create New Web Service

1. Click **New +** → **Web Service**
2. Select repository: `SYNAPSE-2.0`
3. Connect

### Step 3: Configure Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `synapse-backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free (or Paid) |

### Step 4: Add Environment Variables

Click **Environment** and add these variables:

```
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/synapse?retryWrites=true&w=majority
JWT_SECRET=your_strong_jwt_secret_here
SESSION_SECRET=your_strong_session_secret_here
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
BACKEND_URL=https://synapse-backend.onrender.com
FRONTEND_URL=https://synapse-2-0.vercel.app
```

### Step 5: Deploy

Click **Create Web Service** and wait for deployment to complete.

**Your backend URL:** `https://synapse-backend.onrender.com` (or custom domain)

---

## 2️⃣ Frontend Deployment (Vercel)

### Step 1: Create Vercel Account & Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Grant Vercel access to your repositories

### Step 2: Import Project

1. Click **Add New** → **Project**
2. Find & select `SYNAPSE-2.0` repository
3. Click **Import**

### Step 3: Configure Build Settings

Vercel should auto-detect Vite, but verify:

| Setting | Value |
|---------|-------|
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |

### Step 4: Add Environment Variables

Under **Environment Variables**, add:

```
VITE_BACKEND_URL=https://synapse-backend.onrender.com
```

### Step 5: Deploy

Click **Deploy** and wait for build to complete.

**Your frontend URL:** `https://synapse-2-0.vercel.app` (or custom domain)

---

## 3️⃣ MongoDB Atlas Setup

### Step 1: Create MongoDB Account

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create account
3. Create a free cluster

### Step 2: Create Database User

1. Go to **Database Access**
2. Create a new user (e.g., `synapse_user`)
3. Save the password

### Step 3: Whitelist IPs

1. Go to **Network Access**
2. Add IP Address: `0.0.0.0/0` (allows all IPs - use restrictively in production)

### Step 4: Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect Your Application**
3. Copy the connection string
4. Replace `<USERNAME>` and `<PASSWORD>` with your database user credentials
5. Replace `<DATABASE>` with `synapse`

**Example:**
```
mongodb+srv://synapse_user:password123@cluster0.mongodb.net/synapse?retryWrites=true&w=majority
```

---

## 4️⃣ Google OAuth Setup

### Step 1: Create OAuth Credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**

### Step 2: Configure Authorized Redirect URIs

Add these URIs:

```
http://localhost:4000/auth/google/callback
https://synapse-backend.onrender.com/auth/google/callback
```

### Step 3: Copy Credentials

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## 5️⃣ GitHub OAuth Setup

### Step 1: Create OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**

### Step 2: Fill in Details

| Field | Value |
|-------|-------|
| **Application name** | `Synapse AI Chat` |
| **Homepage URL** | `https://synapse-2-0.vercel.app` |
| **Authorization callback URL** | `https://synapse-backend.onrender.com/auth/github/callback` |

### Step 3: Copy Credentials

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

---

## 6️⃣ Gemini API Key

### Step 1: Get API Key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy your key

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Backend health check: `https://synapse-backend.onrender.com/health`
- [ ] Frontend loads: `https://synapse-2-0.vercel.app`
- [ ] Signup works
- [ ] Login works
- [ ] OAuth (Google/GitHub) flows complete
- [ ] Chat messages send and receive
- [ ] Chat history persists across sessions
- [ ] AI responses appear correctly

---

## 🐛 Troubleshooting

### Backend won't start

**Error:** `MONGODB_URI not found`

**Solution:** Check `MONGODB_URI` env var is set correctly on Render dashboard.

---

### Frontend can't reach backend

**Error:** `CORS blocked` or `Network error`

**Solution:** 
1. Verify `VITE_BACKEND_URL` is set correctly on Vercel
2. Verify backend `FRONTEND_URL` includes your Vercel domain
3. Check backend CORS config allows Vercel domain

---

### OAuth not working

**Error:** `Redirect URI mismatch`

**Solution:** Verify OAuth app callback URLs match your deployed backend URL.

---

### Build fails on Vercel

**Error:** `npm run build` fails

**Solution:** 
1. Check `vite.config.ts` has correct `outDir: 'build'`
2. Run `npm run build` locally to test
3. Check console for TypeScript errors

---

## 📞 Support

- **Docs:** [Render Docs](https://render.com/docs)
- **Docs:** [Vercel Docs](https://vercel.com/docs)
- **Issues:** [GitHub Issues](https://github.com/ANIRUDDH-VIJAY/SYNAPSE-2.0/issues)

---

<div align="center">

**Good luck! 🚀**

</div>
