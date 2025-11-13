import dotenv from 'dotenv';
dotenv.config();

const backend = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;

async function request(path, opts = {}){
  const url = backend + path;
  const res = await fetch(url, opts);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch(e){ json = text; }
  return { status: res.status, headers: res.headers, body: json };
}

(async ()=>{
  try {
    const email = `testuser+${Date.now()}@example.com`;
    const password = 'password123';
    console.log('Signing up', email);
    const signup = await request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password })
    });
    console.log('Signup status', signup.status, signup.body);

    // Capture cookie from signup
    let setCookie = signup.headers.get('set-cookie');
    if (!setCookie) {
      console.log('No set-cookie on signup, attempting login to get token');
      const login = await request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log('Login status', login.status, login.body);
      setCookie = login.headers.get('set-cookie');
    }

    if (!setCookie) throw new Error('No auth cookie set by server');

    // Extract authToken cookie value
    const match = setCookie.match(/authToken=([^;]+);/);
    if (!match) throw new Error('authToken cookie not found in set-cookie');
    const token = match[1];
    console.log('Got authToken cookie (length):', token.length);

    // Call /auth/me with cookie
    const me = await request('/auth/me', { headers: { Cookie: `authToken=${token}` } });
    console.log('/auth/me status', me.status, me.body);

    // Also try Authorization header
    const me2 = await request('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    console.log('/auth/me (bearer) status', me2.status, me2.body);

    console.log('Auth test completed successfully');
  } catch (err) {
    console.error('Auth test error:', err);
    process.exit(1);
  }
})();
