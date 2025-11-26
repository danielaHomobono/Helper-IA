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
  baseURL: `${endpoint}/openai/deployments/${deployment_name}`,
  defaultQuery: { 'api-version': '2024-05-01-preview' },
  defaultHeaders: { 'api-key': api_key }
});

// ==========================================
// FUNCIÓN REUTILIZABLE - Para React Y Teams
// ==========================================
async function handleChatMessage(data) {
  const { message, conversationId, userId } = data;

  if (!message) {
    throw new Error("Falta el mensaje");
  }

  console.log('Llamando a Phi-4 con mensaje:', message);

  const completion = await client.chat.completions.create({
    messages: [
      { role: "user", content: message }
    ],
  });

  const responseText = completion.choices[0].message.content;
  
  return { 
    response: responseText,
    category: 'GENERAL',
    confidence: 0.85,
    suggestedActions: [],
    escalate: false,
    conversationId: conversationId || 'default',
    userId: userId || 'anonymous',
    timestamp: new Date().toISOString()
  };
}

// ==========================================
// Endpoint POST /api/chat (para React)
// ==========================================
router.post('/chat', async (req, res) => {
  console.log('=== PETICIÓN RECIBIDA (React) ===');
  console.log('Body:', req.body);
  
  try {
    const respuesta = await handleChatMessage(req.body);

    console.log('=== RESPUESTA ENVIADA ===');
    console.log(JSON.stringify(respuesta, null, 2));

    res.json(respuesta);
  } catch (error) {
    console.error("Error llamando a Phi-4:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Exportar router y función reutilizable
module.exports = router;
module.exports.handleChatMessage = handleChatMessage;
