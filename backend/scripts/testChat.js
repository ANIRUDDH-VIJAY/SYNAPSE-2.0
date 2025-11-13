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

    let token = signup.body?.token;
    if (!token) {
      // try login
      const login = await request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      console.log('Login status', login.status, login.body);
      token = login.body?.token;
    }

    if (!token) throw new Error('No token returned from signup/login');
    console.log('Got token length', token.length);

    // Send first message without chatId
    const msg1 = await request('/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text: 'Hello, this is first message' })
    });
    console.log('Msg1 status', msg1.status, 'body keys:', Object.keys(msg1.body || {}));
    const chatId1 = msg1.body?.chatId;
    console.log('chatId1', chatId1);

    // Send second message without chatId quickly
    const msg2 = await request('/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text: 'Second quick follow-up message' })
    });
    console.log('Msg2 status', msg2.status, 'body keys:', Object.keys(msg2.body || {}));
    const chatId2 = msg2.body?.chatId;
    console.log('chatId2', chatId2);

    if (chatId1 && chatId2 && String(chatId1) === String(chatId2)) {
      console.log('\nSUCCESS: both messages landed in the same chat:', chatId1);
      process.exit(0);
    } else {
      console.error('\nFAIL: messages ended up in different chats', chatId1, chatId2);
      process.exit(2);
    }
  } catch (err) {
    console.error('Chat test error:', err);
    process.exit(1);
  }
})();
