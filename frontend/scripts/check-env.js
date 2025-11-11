// scripts/check-env.js
const required = ['VITE_BACKEND_URL', 'VITE_GOOGLE_CLIENT_ID', 'VITE_GITHUB_CLIENT_ID'];
const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('Missing required frontend env vars:', missing.join(', '));
  process.exit(1);
}
console.log('Frontend env check OK');
