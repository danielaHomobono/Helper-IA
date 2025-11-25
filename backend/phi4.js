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
  console.log('=== PETICIÓN RECIBIDA ===');
  console.log('Body:', req.body);
  
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    console.log('Llamando a Phi-4 con mensaje:', message);

    const completion = await client.chat.completions.create({
      messages: [
        { role: "user", content: message }
      ],
    });

    const responseText = completion.choices[0].message.content;
    
    const respuesta = { 
      response: responseText,
      category: 'GENERAL',
      confidence: 0.85,
      suggestedActions: [],
      escalate: false,
      conversationId: req.body.conversationId || 'default',
      timestamp: new Date().toISOString()
    };

    console.log('=== RESPUESTA ENVIADA ===');
    console.log(JSON.stringify(respuesta, null, 2));

    res.json(respuesta);
  } catch (error) {
    console.error("Error llamando a Phi-4:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
