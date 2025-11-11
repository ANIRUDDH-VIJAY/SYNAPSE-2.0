// scripts/check-env.js
const required = ['PORT','MONGODB_URI','SESSION_SECRET','FRONTEND_URL'];
const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('Missing required backend env vars:', missing.join(', '));
  process.exit(1);
}
console.log('Backend env check OK');
