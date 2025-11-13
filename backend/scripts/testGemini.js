import dotenv from 'dotenv';
dotenv.config();
import getGeminiAPIResponse from '../services/geminiService.js';

(async () => {
  try {
    const res = await getGeminiAPIResponse([
      { role: 'user', content: 'Say hello in a friendly way.' }
    ]);
    console.log('Gemini response:', res);
  } catch (err) {
    console.error('Gemini error:', err && err.stack ? err.stack : err);
  }
})();
