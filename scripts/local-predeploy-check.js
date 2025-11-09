import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from frontend's .env
dotenv.config({ path: path.resolve(__dirname, '../frontend/.env') });

async function runPredeployCheck() {
  try {
    // Get backend URL from environment or use fallback
    const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const AUTH_TOKEN = process.env.TEST_AUTH_TOKEN;

    // Check if auth token is provided
    if (!AUTH_TOKEN) {
      console.error('\n❌ TEST_AUTH_TOKEN environment variable is required.');
      console.error('Please set TEST_AUTH_TOKEN with a valid JWT token before running this check.');
      console.error('\nExample:');
      console.error('  export TEST_AUTH_TOKEN=your.jwt.token  # Linux/Mac');
      console.error('  $env:TEST_AUTH_TOKEN="your.jwt.token"  # Windows PowerShell');
      console.error('  set TEST_AUTH_TOKEN=your.jwt.token     # Windows CMD\n');
      process.exit(1);
    }

    console.log('\n🔍 Running pre-deployment checks...');
    console.log(`Backend URL: ${BACKEND_URL}\n`);

    // Test auth endpoint
    console.log('Testing /auth/me endpoint...');
    const authResponse = await fetch(`${BACKEND_URL}/auth/me`, {
      credentials: 'include',
      headers: {
        'Cookie': `authToken=${AUTH_TOKEN}`
      }
    });

    if (!authResponse.ok) {
      console.error(`\n❌ /auth/me check failed with status ${authResponse.status}`);
      const authError = await authResponse.text();
      console.error('Response:', authError);
      process.exit(1);
    }

    console.log('✅ Auth check passed\n');

    // Test chat creation endpoint
    console.log('Testing /chat/create endpoint...');
    const chatResponse = await fetch(`${BACKEND_URL}/chat/create`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': `authToken=${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
        'X-CSRF-Token': AUTH_TOKEN // Using auth token as CSRF token for test
      }
    });

    if (!chatResponse.ok) {
      console.error(`\n❌ /chat/create check failed with status ${chatResponse.status}`);
      const chatError = await chatResponse.text();
      console.error('Response:', chatError);
      process.exit(1);
    }

    console.log('✅ Chat creation check passed\n');
    console.log('✅ All pre-deployment checks passed successfully!\n');

  } catch (error) {
    console.error('\n❌ Pre-deployment check failed with error:');
    console.error(error.message || error);
    process.exit(1);
  }
}

runPredeployCheck();