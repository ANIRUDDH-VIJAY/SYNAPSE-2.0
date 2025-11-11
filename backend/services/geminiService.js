import dotenv from "dotenv";

dotenv.config();

// Validate API key
if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.trim()) {
  console.warn('⚠️  GEMINI_API_KEY is not set. AI features will not work.');
}

// genAI will be initialized on-demand inside getGeminiAPIResponse
let genAI = null;

async function ensureClient() {
  if (genAI) return genAI;
  if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_API_KEY.trim()) {
    return null;
  }
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    return genAI;
  } catch (e) {
    console.error('Failed to initialize Google Generative AI client:', e?.message || e);
    genAI = null;
    return null;
  }
}

// Best → fallback order
const MODELS_TO_TRY = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

/**
 * Build valid Gemini chat history from stored messages.
 */
function buildHistory(messages) {
  if (!messages || messages.length === 0) return [];

  const cleaned = messages
    .filter(m => m && m.content)
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

  // Remove consecutive duplicate-role messages
  const final = [];
  for (const msg of cleaned) {
    if (final.length === 0 || final[final.length - 1].role !== msg.role) {
      final.push(msg);
    }
  }

  // Ensure history starts with user
  if (final[0]?.role !== "user") {
    final.shift();
  }

  return final;
}

/**
 * Conversational response with fallback + streaming correctness.
 */
async function getGeminiAPIResponse(messages) {
  const client = await ensureClient();
  if (!client) {
    throw new Error("Gemini API key is not configured or client failed to initialize. Please set GEMINI_API_KEY in your environment variables.");
  }
  
  if (!messages || messages.length === 0) {
    throw new Error("No messages provided to Gemini.");
  }

  const newPrompt = messages[messages.length - 1].content;
  const history = buildHistory(messages.slice(0, -1));

  let lastError = null;

  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = client.getGenerativeModel({ model: modelName });
      const chat = model.startChat({ history });

      const result = await chat.sendMessage(newPrompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      lastError = err;

      // Allowed fallback case: rate limit
      if (String(err?.message)?.includes("429")) {
        continue;
      }

      // Any other error → do not continue to next model
      throw err;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || lastError}`
  );
}

export default getGeminiAPIResponse;
