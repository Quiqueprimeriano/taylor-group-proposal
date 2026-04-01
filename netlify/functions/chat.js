const Anthropic = require('@anthropic-ai/sdk');
const { MODEL, MAX_TOKENS, TEMPERATURE, MAX_HISTORY, ALLOWED_ORIGINS, validateMessages, buildSystemPrompt } = require('../../lib/tay-system-prompt');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Rate limiting (in-memory, per warm container) ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per IP per window
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

function getCorsOrigin(event) {
  const origin = (event.headers || {}).origin || (event.headers || {}).Origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.endsWith('.netlify.app')) return origin;
  return ALLOWED_ORIGINS[0];
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': getCorsOrigin(event),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Rate limit by client IP
  const clientIp = (event.headers || {})['x-forwarded-for'] || (event.headers || {})['client-ip'] || 'unknown';
  if (isRateLimited(clientIp)) {
    return { statusCode: 429, headers, body: JSON.stringify({ error: 'Too many requests. Please wait a moment.' }) };
  }

  try {
    const { messages, section } = JSON.parse(event.body);

    const validationError = validateMessages(messages);
    if (validationError) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: validationError }) };
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: buildSystemPrompt(section),
      messages: messages.slice(-MAX_HISTORY)
    });

    const text = response.content[0].text;
    return { statusCode: 200, headers, body: JSON.stringify({ response: text }) };
  } catch (err) {
    console.error('Claude API error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to get response' }) };
  }
};
