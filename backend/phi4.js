const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

// ==============================
// CLIENTES PHI-4
// ==============================
const phi4Client = new OpenAI({
  apiKey: process.env.PHI4_API_KEY,
  baseURL: `${process.env.PHI4_API_URL}/openai/deployments/${process.env.PHI4_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.PHI4_API_VERSION },
  defaultHeaders: { 'api-key': process.env.PHI4_API_KEY }
});

const phi4ReasoningClient = new OpenAI({
  apiKey: process.env.PHI4S_API_KEY,
  baseURL: `${process.env.PHI4S_API_URL}/openai/deployments/${process.env.PHI4S_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.PHI4S_API_VERSION },
  defaultHeaders: { 'api-key': process.env.PHI4S_API_KEY }
});

// ==============================
// EVALUADOR DE CONFIANZA
// ==============================
function evaluarConfianza(message) {
  if (!message) return { confianzaAlta: true, score: 100 };

  const texto = message.toLowerCase();

  // Factor palabras sensibles
  const palabrasSensibles = ['error', 'problema', 'confidencial', 'riesgo', 'incidente'];
  const contienePalabraSensible = palabrasSensibles.some(p => texto.includes(p));
  let factorPalabra = contienePalabraSensible ? 0.4 : 1;

  // Factor longitud
  const len = texto.length;
  let factorLongitud = 1;
  if (len > 200) factorLongitud = 0.7;
  else if (len < 20) factorLongitud = 1;

  // Factor signos
  const signos = (texto.match(/[!?]/g) || []).length;
  let factorSignos = 1 - Math.min(signos * 0.05, 0.2);

  // Score final
  let score = Math.round(100 * factorPalabra * factorLongitud * factorSignos);
  const confianzaAlta = score > 70;

  return { confianzaAlta, score };
}

// ==============================
// FUNCIONES MODELOS
// ==============================
async function callPhi4(message) {
  if (!message) throw new Error("Falta mensaje para Phi-4");

  const completion = await phi4Client.chat.completions.create({
    messages: [{ role: "user", content: message }],
  });

  return completion.choices[0].message.content;
}

async function callPhi4Reasoning(message) {
  if (!message) throw new Error("Falta mensaje para Phi-4-Reasoning");

  const completion = await phi4ReasoningClient.chat.completions.create({
    messages: [{ role: "user", content: message }],
  });

  return completion.choices[0].message.content;
}

// ==============================
// ENDPOINT POST /api/chat
// ==============================
router.post('/chat', async (req, res) => {
  const { message, conversationId, userId } = req.body;

  try {
    const { confianzaAlta, score } = evaluarConfianza(message);

    const responseText = confianzaAlta
      ? await callPhi4(message)
      : await callPhi4Reasoning(message);

    const respuesta = {
      response: responseText,
      confianzaAlta,
      score, // porcentaje 0-100
      conversationId: conversationId || 'default',
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString()
    };

    res.json(respuesta);
  } catch (error) {
    console.error("❌ Error manejando el mensaje:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
