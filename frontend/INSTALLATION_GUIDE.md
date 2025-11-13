# 🚀 SYNAPSE 2.0 - Installation & Setup Guide

## Prerequisites

Before installing, ensure you have:

1. **Node.js** (v18.0.0 or higher)
   - Check version: `node --version`
   - Download: https://nodejs.org/

2. **npm** (comes with Node.js)
   - Check version: `npm --version`

3. **MongoDB** (local or cloud instance)
   - Local: https://www.mongodb.com/try/download/community
   - Cloud: https://www.mongodb.com/cloud/atlas (free tier available)

4. **Google Gemini API Key**
   - Get from: https://makersuite.google.com/app/apikey

---

## 📦 Installation Steps

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Backend Dependencies (11 packages):**
- express ^4.18.2
- mongoose ^8.0.0
- bcryptjs ^2.4.3
- jsonwebtoken ^9.0.2
- cors ^2.8.5
- helmet ^7.1.0
- morgan ^1.10.0
- express-rate-limit ^7.1.5
- dotenv ^16.3.1
- uuid ^9.0.1
- @google/generative-ai ^0.1.3

### Step 2: Install Frontend Dependencies

```bash
cd ..  # Go back to root
npm install
```

**Frontend Dependencies (50+ packages):**
- react ^18.3.1
- react-dom ^18.3.1
- axios ^1.6.0 (newly added)
- All Radix UI components
- Tailwind CSS utilities
- Vite build tools

---

## ⚙️ Environment Configuration

### Step 3: Create Backend `.env` File

Create `backend/.env` with the following:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/synapse
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/synapse

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your-gemini-api-key-here
```

**Important:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a strong random string (use `openssl rand -base64 32`)
- Replace `GEMINI_API_KEY` with your actual Gemini API key

### Step 4: Create Frontend `.env` File

Create `.env` in the root directory (same level as `package.json`):

```env
VITE_APP_NAME=Synapse
VITE_BACKEND_URL=http://localhost:4000
```

---

## ✅ Verification Checklist

### Verify Backend Setup

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v18.0.0 or higher
   ```

2. **Verify backend dependencies:**
   ```bash
   cd backend
   npm list --depth=0
   ```
   Should show all 11 packages installed.

3. **Verify `.env` file exists:**
   ```bash
   ls backend/.env  # Should exist
   ```

4. **Test MongoDB connection:**
   - Ensure MongoDB is running locally, OR
   - Verify your MongoDB Atlas connection string is correct

### Verify Frontend Setup

1. **Verify frontend dependencies:**
   ```bash
   cd ..  # Back to root
   npm list --depth=0
   ```
   Should show axios and other packages.

2. **Verify `.env` file exists:**
   ```bash
   ls .env  # Should exist in root directory
   ```

3. **Check TypeScript types:**
   ```bash
   ls src/vite-env.d.ts  # Should exist
   ```

---

## 🏃 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB connected
🚀 Server running on http://localhost:4000
```

### Terminal 2: Start Frontend Server

```bash
# From root directory
npm run dev
```

**Expected output:**
```
  VITE v6.3.5  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🧪 Quick Test

1. **Test Backend Health:**
   ```bash
   curl http://localhost:4000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Frontend:**
   - Open http://localhost:5173
   - Should see the landing page
   - Click "Get Started" or "Sign Up"
   - Try creating an account

3. **Test Full Flow:**
   - Sign up with email/password
   - Create a new chat
   - Send a message
   - Verify AI response appears

---

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```
❌ MongoDB connection failed
```
- Check if MongoDB is running: `mongod --version`
- Verify `MONGODB_URI` in `.env` is correct
- For Atlas: Check IP whitelist and credentials

**Port 4000 Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::4000
```
- Change `PORT` in `backend/.env` to another port (e.g., 4001)
- Update `VITE_BACKEND_URL` in frontend `.env` accordingly

**Missing Dependencies:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Axios Not Found:**
```
Cannot find module 'axios'
```
- Run: `npm install` in root directory

**Environment Variables Not Loading:**
- Ensure `.env` file is in root directory (not in `src/`)
- Restart Vite dev server after creating `.env`
- Variables must start with `VITE_`

**TypeScript Errors:**
- Ensure `src/vite-env.d.ts` exists
- Restart TypeScript server in your IDE

### Gemini API Issues

**Rate Limit Error:**
```
AI service is temporarily busy
```
- Wait a few seconds and try again
- Check your Gemini API quota

**Invalid API Key:**
- Verify `GEMINI_API_KEY` in `backend/.env`
- Ensure no extra spaces or quotes

---

## 📋 Complete Installation Command Summary

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Create backend .env file (copy template above)

# 3. Install frontend dependencies
cd ..
npm install

# 4. Create frontend .env file (copy template above)

# 5. Start backend (Terminal 1)
cd backend
npm run dev

# 6. Start frontend (Terminal 2)
cd ..
npm run dev
```

---

## ✨ You're All Set!

Once both servers are running:
- **Backend:** http://localhost:4000
- **Frontend:** http://localhost:5173

Open your browser to http://localhost:5173 and start chatting! 🎉


