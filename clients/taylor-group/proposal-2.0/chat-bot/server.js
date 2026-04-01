require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const { MODEL, MAX_TOKENS, TEMPERATURE, MAX_HISTORY, ALLOWED_ORIGINS, validateMessages, buildSystemPrompt } = require('../../../../lib/tay-system-prompt');

const app = express();
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.netlify.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, section } = req.body;

    const validationError = validateMessages(messages);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      system: buildSystemPrompt(section),
      messages: messages.slice(-MAX_HISTORY)
    });

    const text = response.content[0].text;
    res.json({ response: text });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Tay Chatbot Server' });
});

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Tay server running on http://localhost:${PORT}`);
});
