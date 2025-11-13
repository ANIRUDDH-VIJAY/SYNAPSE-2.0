#!/usr/bin/env node

/**
 * Quick verification script for SYNAPSE 2.0 setup
 * Run: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying SYNAPSE 2.0 Setup...\n');

let errors = [];
let warnings = [];

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  errors.push(`Node.js version ${nodeVersion} is too old. Need v18.0.0 or higher.`);
} else {
  console.log(`✅ Node.js version: ${nodeVersion}`);
}

// Check backend structure
const backendFiles = [
  'backend/server.js',
  'backend/package.json',
  'backend/models/User.js',
  'backend/models/Chat.js',
  'backend/routes/auth.js',
  'backend/routes/chat.js',
  'backend/middleware/auth.js',
  'backend/services/geminiService.js'
];

console.log('\n📁 Checking Backend Files:');
backendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    errors.push(`Missing: ${file}`);
    console.log(`  ❌ ${file}`);
  }
});

// Check frontend structure
const frontendFiles = [
  'src/App.tsx',
  'src/services/api.ts',
  'src/components/pages/ChatPage.tsx',
  'src/components/modals/AuthModal.tsx',
  'package.json',
  'vite.config.ts'
];

console.log('\n📁 Checking Frontend Files:');
frontendFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    errors.push(`Missing: ${file}`);
    console.log(`  ❌ ${file}`);
  }
});

// Check .env files
console.log('\n⚙️  Checking Environment Files:');
if (fs.existsSync('backend/.env')) {
  console.log('  ✅ backend/.env exists');
  const backendEnv = fs.readFileSync('backend/.env', 'utf8');
  const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY', 'FRONTEND_URL'];
  requiredVars.forEach(varName => {
    if (backendEnv.includes(varName)) {
      console.log(`    ✅ ${varName} is set`);
    } else {
      warnings.push(`Backend .env missing: ${varName}`);
      console.log(`    ⚠️  ${varName} not found`);
    }
  });
} else {
  errors.push('Missing: backend/.env');
  console.log('  ❌ backend/.env not found');
}

if (fs.existsSync('.env')) {
  console.log('  ✅ .env exists (frontend)');
  const frontendEnv = fs.readFileSync('.env', 'utf8');
  if (frontendEnv.includes('VITE_BACKEND_URL')) {
    console.log('    ✅ VITE_BACKEND_URL is set');
  } else {
    warnings.push('Frontend .env missing: VITE_BACKEND_URL');
    console.log('    ⚠️  VITE_BACKEND_URL not found');
  }
} else {
  warnings.push('Missing: .env (frontend) - optional, will use defaults');
  console.log('  ⚠️  .env not found (will use defaults)');
}

// Check node_modules
console.log('\n📦 Checking Dependencies:');
if (fs.existsSync('backend/node_modules')) {
  console.log('  ✅ Backend node_modules installed');
} else {
  warnings.push('Backend dependencies not installed. Run: cd backend && npm install');
  console.log('  ⚠️  Backend node_modules not found');
}

if (fs.existsSync('node_modules')) {
  console.log('  ✅ Frontend node_modules installed');
} else {
  warnings.push('Frontend dependencies not installed. Run: npm install');
  console.log('  ⚠️  Frontend node_modules not found');
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Ready to run.\n');
  console.log('Next steps:');
  console.log('  1. cd backend && npm run dev');
  console.log('  2. cd .. && npm run dev');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} error(s) found:\n`);
    errors.forEach(err => console.log(`   - ${err}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} warning(s):\n`);
    warnings.forEach(warn => console.log(`   - ${warn}`));
  }
}
console.log('='.repeat(50));

process.exit(errors.length > 0 ? 1 : 0);


