const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Configuración del cliente OpenAI (Phi-4)
require('dotenv').config();
const endpoint = process.env.OPENAI_ENDPOINT;
const api_key = process.env.OPENAI_API_KEY;
const deployment_name = process.env.DEPLOYMENT_NAME;


const client = new OpenAI({
  apiKey: api_key,
  baseURL: `${endpoint}openai/deployments/${deployment_name}`,
  defaultQuery: { "api-version": process.env.API_VERSION }
});

// Endpoint POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    const completion = await client.chat.completions.create({
      model: deployment_name,
      messages: [
        { role: "user", content: message }
      ],
    });

    const responseText = completion.choices[0].message.content;

    res.json({ reply: responseText });
  } catch (error) {
    console.error("Error llamando a Phi-4:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
