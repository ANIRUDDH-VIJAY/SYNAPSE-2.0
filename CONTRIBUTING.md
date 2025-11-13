# Contributing

Thank you for contributing to Synapse AI Chat. This document outlines the basic development workflow.

Development

1. Install dependencies:

```powershell
cd 'd:\SYNAPSE 5.0\backend'
npm install
cd 'd:\SYNAPSE 5.0\frontend'
npm install
```

2. Copy `.env.example` to `.env` and fill in values for both backend and frontend as needed.

3. Run servers in separate terminals:

```powershell
cd 'd:\SYNAPSE 5.0\backend'
npm run start

cd 'd:\SYNAPSE 5.0\frontend'
npm run dev
```

Tests

- Use the scripts in `backend/scripts` for quick smoke tests (auth, chat, gemini). These scripts are not a replacement for real unit or E2E tests, but helpful during development.

Pull Requests

- Create a topic branch from `main`.
- Add tests for new behavior when possible.
- Open a PR describing the change, add screenshots for UI changes.
