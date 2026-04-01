import Anthropic from '@anthropic-ai/sdk';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { MODEL, MAX_TOKENS, TEMPERATURE, MAX_HISTORY, ALLOWED_ORIGINS, validateMessages, buildSystemPrompt } = require('../../lib/tay-system-prompt');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Rate limiting (in-memory, per warm container)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function getCorsOrigin(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin && origin.endsWith('.netlify.app')) return origin;
  return ALLOWED_ORIGINS[0];
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': getCorsOrigin(origin),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

export default async (req) => {
  const origin = req.headers.get('origin') || '';
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  // Rate limit
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('client-ip') || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  let messages, section;
  try {
    const body = await req.json();
    messages = body.messages;
    section = body.section;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  const validationError = validateMessages(messages);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE,
          system: buildSystemPrompt(section),
          messages: messages.slice(-MAX_HISTORY)
        });

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        console.error('Claude streaming error:', err.message);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Failed to get response' })}\n\n`));
      }
      controller.close();
    }
  });

  return new Response(readableStream, {
    status: 200,
    headers: {
      ...headers,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
};

export const config = {
  path: '/api/chat-stream'
};
