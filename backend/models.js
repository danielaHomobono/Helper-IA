const { OpenAI } = require('openai');
require('dotenv').config();

// ==============================
// CONFIGURACIÓN PHI-4 (Alta Confianza)
// ==============================
const phi4Client = new OpenAI({
  apiKey: process.env.PHI4_API_KEY,
  baseURL: `${process.env.PHI4_API_URL}/openai/deployments/${process.env.PHI4_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.PHI4_API_VERSION },
  defaultHeaders: { 'api-key': process.env.PHI4_API_KEY }
});

// ==============================
// CONFIGURACIÓN PHI-4-REASONING (Baja Confianza)
// ==============================
const phi4ReasoningClient = new OpenAI({
  apiKey: process.env.PHI4S_API_KEY,
  baseURL: `${process.env.PHI4S_API_URL}/openai/deployments/${process.env.PHI4S_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': process.env.PHI4S_API_VERSION },
  defaultHeaders: { 'api-key': process.env.PHI4S_API_KEY }
});

// ==============================
// FUNCIONES REUTILIZABLES
// ==============================
async function callPhi4(message) {
  if (!message) throw new Error("Falta el mensaje para Phi-4");

  const completion = await phi4Client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Eres el "Agente Base". 
                Tu objetivo es responder consultas generales de forma rápida y clara.
                Siempre indicas en tu respuesta: "Agente que respondió: Agente Base".`
      },
      { role: "user", content: message }
    ],
  });

  return completion.choices[0].message.content;
}

async function callPhi4Reasoning(message) {
  if (!message) throw new Error("Falta el mensaje para Phi-4-Reasoning");

  const completion = await phi4ReasoningClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Eres el "Agente Experto Supervisor".
                Tu tarea es analizar preguntas complejas, ambiguas o de baja confianza detectada.
                Siempre indicas en tu respuesta: "Agente que respondió: Agente Experto Supervisor".`
      },
      { role: "user", content: message }
    ],
  });

  return completion.choices[0].message.content;
}

// ==============================
// EXPORTAR FUNCIONES
// ==============================
module.exports = {
  callPhi4,
  callPhi4Reasoning
};
