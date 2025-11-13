<!--- Synapse 2.0: AI Chat Platform README ---><!--- NOTE: This README is generated to be developer- and recruiter-friendly. --->

# Synapse AI Chat — Fullstack Application

# 💬 Synapse AI Chat  

A developer-focused, production-ready AI chat application with a React + Vite frontend and an Express + MongoDB backend. This repository includes JWT auth, Google & GitHub OAuth, AI integration (Gemini), chat persistence, and a responsive UI.

**Full-stack AI Chat Application | React + Express + MongoDB + Gemini AI**

---

> A production-ready AI chat platform featuring secure authentication (JWT + OAuth), real-time Gemini AI integration, and persistent chat history — built with modern fullstack technologies.

## Quick links

---- Local frontend: http://localhost:5173/

- Local backend health: http://localhost:4000/health

## 🔗 Quick Links

---

| Service | Local URL | Deployed |

|---------|-----------|----------|## Table of Contents

| Frontend | [http://localhost:5173](http://localhost:5173) | [Vercel](https://synapse-2-0.vercel.app) |- [Project summary](#project-summary)

| Backend | [http://localhost:4000](http://localhost:4000) | [Render](https://synapse-backend.onrender.com) |- [Tech stack](#tech-stack)

- [Project flow & architecture](#project-flow--architecture)

---- [Setup & run (developer)](#setup--run-developer)

- [Environment variables](#environment-variables)

## 🚀 Overview- [Testing / verification checklist (how I tested)](#testing--verification-checklist-how-i-tested)

- [Recruiter-friendly summary](#recruiter-friendly-summary)

Synapse 2.0 is a **developer-focused AI chat application** designed for performance, scalability, and modern UX. It combines secure authentication, real-time AI responses, and persistent chat history into a seamless, production-ready platform.- [Contributing / Notes](#contributing--notes)



### ✨ Key Features---



- 🔐 **Secure Authentication**: JWT + OAuth (Google, GitHub via Passport)## Project summary

- 🤖 **AI Chat**: Google Gemini integration with multi-model fallback

- 💾 **Chat Persistence**: Full message history per user via MongoDBSynapse is an AI-powered chat application with:

- ⚡ **Fast Frontend**: React 18 + Vite + TypeScript + TailwindCSS- Persistent chats stored in MongoDB

- 🧩 **Scalable Backend**: Node.js + Express with modular architecture- Server-side AI calls to Google Gemini (with multi-model fallback and graceful error handling)

- 🌐 **Real-time Streaming**: AI responses stream token-by-token for smooth UX- JWT-based authentication and OAuth (Google + GitHub)

- 🔒 **Enterprise Security**: CSRF protection, rate limiting, helmet security headers- A reactive, responsive UI built with React + Vite and a component library structure



---This README focuses on how to run the app locally, what to look for, and what a recruiter or engineer will want to know.



## 🧠 Tech Stack---



| Layer | Technology |## Tech stack

|-------|-------------|

| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, Radix UI |- Frontend: React 18, Vite, TypeScript, Tailwind/CSS (component structure in `frontend/src/components`)

| **Backend** | Node.js (18+), Express.js, Mongoose |- Backend: Node.js (>=18), Express, Mongoose (MongoDB)

| **Auth** | JWT + OAuth 2.0 (Google, GitHub via Passport.js) |- Authentication: JWT + OAuth (Google, GitHub) via Passport

| **AI** | Google Generative AI (`@google/generative-ai`) |- AI: Google Generative AI client (`@google/generative-ai`) with fallback logic

| **Database** | MongoDB (Mongoose ODM) |- Dev tooling: Vite, ESLint/Typescript types (dev deps), npm

| **Tooling** | ESLint, npm, Vite, TypeScript |

---

---

## Project flow & architecture

## 🏗️ Architecture Overview

High-level flow:

```

┌─────────────────┐1. User authenticates (JWT or OAuth). Backend issues a JWT for API calls.

│  React Frontend │ (http://localhost:5173)2. User opens chat page. Frontend fetches chat history from `/chat/history`.

│  + TypeScript   │3. When user sends a message, frontend posts to `/chat/message` or `/chat/message/stream`.

│  + TailwindCSS  │4. Backend persists user message, calls Gemini via `services/geminiService.js` and appends assistant response.

└────────┬────────┘5. Frontend receives streaming-like chunks (`data: {...}` SSE-like lines) and renders tokens/typing animations.

         │ (API calls + Auth)

         ▼Key components and locations:

┌─────────────────┐- `backend/src/index.js` — server entry, middleware, routing

│  Express API    │ (http://localhost:4000)- `backend/routes` — API routes (auth.js, chat.js, feedback.js, admin.js)

│  + JWT/OAuth    │- `backend/services/geminiService.js` — AI client wrapper with model fallback

│  + Rate Limit   │- `frontend/src` — React app, components for ChatWindow, ChatList, Composer, modals

└────────┬────────┘

         │Architecture diagram (simplified):

    ┌────┴────┐

    ▼         ▼Client (React) ↔ Backend (Express + Passport/JWT) ↔ MongoDB

┌─────────┐ ┌──────────────┐                                     ↳ Gemini API (external)

│ MongoDB │ │ Gemini AI    │

└─────────┘ └──────────────┘---

```

## Setup & run (developer)

**Data Flow:**

1. User authenticates via JWT or OAuth → token stored in httpOnly cookie + localStoragePrerequisites:

2. Chat page loads → fetches conversation history from `/chat/history`- Node.js 18+ installed

3. User sends message → POST to `/chat/message` endpoint- A running MongoDB instance (local or cloud)

4. Backend stores user message → queries Google Gemini API → streams response- Valid Gemini API key for AI features

5. Frontend displays streaming response token-by-token for smooth typing animation- Google and GitHub OAuth credentials (set in `.env`) — only required if you need OAuth flows



---1) Install dependencies (run from workspace root or each folder):



## 🏃 Quick Start```powershell

cd 'd:\SYNAPSE 5.0\backend'

### Prerequisitesnpm install



- **Node.js** ≥ 18.18cd 'd:\SYNAPSE 5.0\frontend'

- **MongoDB** (local or cloud instance)npm install

- **API Keys:**```

  - [Google Gemini API](https://aistudio.google.com/app/apikey)

  - [Google OAuth](https://console.cloud.google.com/) (optional)2) Create `.env` files

  - [GitHub OAuth](https://github.com/settings/developers) (optional)

Create `backend/.env` with at least the following values (replace placeholders):

### Installation

```

```bashPORT=4000

# Clone repoMONGODB_URI=mongodb://localhost:27017/synapse

git clone https://github.com/ANIRUDDH-VIJAY/SYNAPSE-2.0.gitSESSION_SECRET=super_secret_here

cd SYNAPSE-2.0JWT_SECRET=another_secret_here

GEMINI_API_KEY=your_gemini_api_key_here

# BackendGOOGLE_CLIENT_ID=your_google_client_id

cd backendGOOGLE_CLIENT_SECRET=your_google_client_secret

npm installGITHUB_CLIENT_ID=your_github_client_id

cp .env.example .env              # Fill in your API keysGITHUB_CLIENT_SECRET=your_github_client_secret

npm run start                     # Runs on http://localhost:4000NODE_ENV=development

```

# Frontend (new terminal)

cd frontendFrontend environment variables (if needed) — create `frontend/.env` (Vite uses VITE_ prefix):

npm install

cp .env.example .env              # Set VITE_BACKEND_URL```

npm run dev                       # Runs on http://localhost:5173VITE_API_URL=http://localhost:4000

``````



**Access the app:** 👉 [http://localhost:5173](http://localhost:5173)3) Run the backend and frontend in separate terminals (PowerShell):



---```powershell

# Backend

## 🔐 Environment Variablescd 'd:\SYNAPSE 5.0\backend'

npm run start

### Backend (`.env`)

# Frontend

```bashcd 'd:\SYNAPSE 5.0\frontend'

# Servernpm run dev

PORT=4000```

NODE_ENV=development

Open http://localhost:5173 for the UI and the backend health at http://localhost:4000/health.

# Database

MONGODB_URI=mongodb://localhost:27017/synapse---



# Authentication## Environment variables (detailed)

JWT_SECRET=your_secure_jwt_secret_key

JWT_EXPIRES_IN=7dBackend (required for full functionality):

SESSION_SECRET=your_session_secret_key- MONGODB_URI — MongoDB connection string

- JWT_SECRET — secret used to sign JWTs

# Google OAuth- SESSION_SECRET — session secret

GOOGLE_CLIENT_ID=your_google_client_id- GEMINI_API_KEY — Gemini/Generative API key

GOOGLE_CLIENT_SECRET=your_google_client_secret

OAuth (only required if you use sign-in providers):

# GitHub OAuth- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

GITHUB_CLIENT_ID=your_github_client_id- GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

GITHUB_CLIENT_SECRET=your_github_client_secret

Frontend:

# AI- VITE_API_URL — base URL for backend API (defaults to http://localhost:4000)

GEMINI_API_KEY=your_gemini_api_key

Security note: Never commit production secrets into source control. Use a secret manager for production deployments.

# URLs

BACKEND_URL=http://localhost:4000---

FRONTEND_URL=http://localhost:5173

```## Testing / verification checklist (how I tested)



### Frontend (`.env`)Follow these steps to verify everything works locally (developer E2E):



```bash1. Start MongoDB locally and set `MONGODB_URI` accordingly.

VITE_BACKEND_URL=http://localhost:40002. Start backend and frontend as shown above.

```3. Signup or sign in (JWT): use the signup form to create a user. Confirm you receive a valid JWT and can hit `/chat/history`.

4. Test OAuth: Click Sign in with Google / GitHub — check that redirects work and a user is created.

### For Production Deployment5. Send a message in Chat window — observe messages appear in same chat, assistant reply appears token-by-token (SSE-like), and final assistant message is saved in DB.

6. Send two quick messages back-to-back — confirm they belong to the same chat (check DB or chat UI order).

**Render (Backend):**7. Profile and Settings: open profile modal and settings modal — update fields and save; ensure data persists if endpoints exist.

```bash

MONGODB_URI=<your_mongodb_atlas_uri>If AI is overloaded, the backend returns HTTP 503 with a clear message and the frontend displays a user-facing message.

FRONTEND_URL=https://synapse-2-0.vercel.app

# ... other secrets---

```

## Recruiter-friendly summary

**Vercel (Frontend):**

```bashHighlights to show in a portfolio or GitHub:

VITE_BACKEND_URL=https://synapse-backend.onrender.com

```- Role: Fullstack developer (React, TypeScript, Node.js)

- Responsibilities implemented: authentication (JWT + OAuth), integration with external AI APIs, data persistence with MongoDB, responsive frontend, robust error handling

See `.env.example` files for complete templates.- Key achievements:

  - Implemented multi-model fallback and graceful error handling for Gemini API

---  - Streaming-compatible SSE-like responses for improved UX during AI generations

  - Secure session handling and flexible auth (JWT + OAuth)

## 🧪 Verification Checklist- Scalability & reliability considerations:

  - Rate limiting at the API layer

| Feature | Status |  - Helmet and security middleware enabled

|---------|--------|  - Session cookies configured for cross-site usage where needed

| JWT signup/login | ✅ Working |

| OAuth (Google/GitHub) | ✅ Working |Suggested bullet for resume or GitHub description:

| Chat persistence | ✅ Working |

| Gemini API integration | ✅ Working |> Built a fullstack AI chat application using React, Vite, Node.js, Express and MongoDB, integrating Google Generative AI with multi-model fallback and streaming-compatible responses; implemented secure JWT and OAuth authentication and a responsive React UI.

| Streaming responses | ✅ Working |

| Error handling | ✅ Working |---

| Rate limiting | ✅ Working |

| CSRF protection | ✅ Working |## Contributing / Notes



---- I removed a couple of stale build/output files from the repository to keep it tidy.

- If you want me to prune additional docs or move environment templates into `./templates`, tell me which files to remove or approve the candidates I list.

## 📂 Project Structure

If you'd like, I can also:

```- Add a `CONTRIBUTING.md` with dev workflow and PR template

SYNAPSE-2.0/- Add GitHub Actions to run lint/tests on PRs

├── backend/- Add small E2E tests (Playwright) to validate key flows

│   ├── src/

│   │   └── index.js           # Express server entry---

│   ├── routes/

│   │   ├── auth.js            # JWT + OAuth routes## Contact / Support

│   │   └── chat.js            # Chat endpoints

│   ├── models/If you need step-by-step help to deploy this to a staging environment or CI, I can add deployment scripts (Dockerfile, GitHub Actions) and documentation.

│   │   ├── User.js            # Mongoose User schema

│   │   └── Chat.js            # Mongoose Chat schema---

│   ├── middleware/

│   │   ├── auth.js            # JWT verificationLicense: MIT (add license file if needed)

│   │   └── csrf.js            # CSRF protection
│   ├── services/
│   │   └── geminiService.js   # AI API wrapper
│   ├── config/
│   │   └── passport.js        # OAuth strategies
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── main.tsx           # Vite entry point
│   │   ├── components/
│   │   │   ├── chat/          # Chat UI components
│   │   │   ├── auth/          # Auth forms
│   │   │   └── ui/            # Radix UI primitives
│   │   ├── services/
│   │   │   ├── api.ts         # Axios instance + endpoints
│   │   │   └── chatService.ts # Chat API client
│   │   └── styles/
│   │       └── globals.css    # TailwindCSS + custom styles
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── .gitignore
├── README.md                  # This file
├── CONTRIBUTING.md
└── SECURITY_FIXES.md
```

---

## 🚀 Deployment

### Backend → Render

1. Create [Render account](https://render.com)
2. New Web Service → Connect GitHub repo
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add environment variables (from screenshot or `.env.example`)
6. Deploy!

### Frontend → Vercel

1. Create [Vercel account](https://vercel.com)
2. Import project from GitHub
3. Set `VITE_BACKEND_URL` → Render backend URL
4. Deploy!

---

## 🧑‍💻 Developer Guide

### Running Locally

```bash
# Terminal 1: Backend
cd backend && npm run start

# Terminal 2: Frontend
cd frontend && npm run dev
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | — | Register user |
| POST | `/auth/login` | — | Login user |
| POST | `/auth/logout` | JWT | Logout |
| GET | `/auth/me` | JWT | Get current user |
| POST | `/chat/create` | JWT | Create chat |
| POST | `/chat/message` | JWT | Send message |
| GET | `/chat/history` | JWT | Get all chats |
| GET | `/chat/:id` | JWT | Get chat details |

### Testing Auth

```bash
# Login/signup at http://localhost:5173
# JWT token auto-stored in localStorage + httpOnly cookie
# All subsequent requests include Authorization header
```

---

## 💼 Portfolio / Recruiter Summary

**Role:** Full-Stack Developer (React + Node.js + AI)

**Technical Highlights:**

- 🔐 Implemented secure JWT + OAuth authentication (Google, GitHub)
- 🤖 Integrated Google Generative AI with streaming responses
- 💾 Designed scalable Express backend with modular architecture
- ⚡ Built responsive React UI with TypeScript + TailwindCSS
- 🗄️ Persisted chat history with MongoDB + Mongoose
- 🧪 Implemented comprehensive error handling & rate limiting
- 🚀 Deployment-ready for Vercel + Render

**Portfolio Bullet:**
> Architected and deployed a full-stack AI chat platform using React, TypeScript, Node.js, Express, and MongoDB—featuring JWT/OAuth authentication, Google Gemini AI integration, streaming responses, and enterprise security patterns. Live at [Synapse-2-0.vercel.app](https://synapse-2-0.vercel.app).

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT © 2025 [Aniruddh Vijayvargia](https://github.com/ANIRUDDH-VIJAY)

---

## 🔗 Links

- **GitHub:** [ANIRUDDH-VIJAY](https://github.com/ANIRUDDH-VIJAY)
- **Live Demo:** [Vercel](https://synapse-2-0.vercel.app)
- **Backend:** [Render](https://synapse-backend.onrender.com)
- **Issues:** [GitHub Issues](https://github.com/ANIRUDDH-VIJAY/SYNAPSE-2.0/issues)

---

<div align="center">

**Made with ❤️ by [Aniruddh Vijayvargia](https://github.com/ANIRUDDH-VIJAY)**

⭐ Star this repo if you found it helpful!

</div>
