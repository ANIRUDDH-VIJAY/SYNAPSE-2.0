## Deployment notes (Vercel + Render)

- Vercel frontend build command (monorepo):

  cd frontend ; npm ci ; npm run build

- Vercel environment variables (frontend)
  - VITE_BACKEND_URL=https://synapse-2-0.onrender.com
  - VITE_GOOGLE_CLIENT_ID
  - VITE_GITHUB_CLIENT_ID

- Render backend environment variables
  - PORT
  - MONGODB_URI
  - SESSION_SECRET
  - FRONTEND_URL=https://synapse-2-0.vercel.app
  - GEMINI_API_KEY

- Node version: pin to 18 via .nvmrc or server/platform setting

Smoke test commands (local):

  # Frontend build check
  cd frontend ; npm ci ; npm run build

  # Backend env check
  cd backend ; node ./scripts/check-env.js
