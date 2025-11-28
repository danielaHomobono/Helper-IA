// Script para chunking y embeddings con OpenAI
// Cargar variables de entorno desde .env
require('dotenv').config();
// Requiere: npm install openai axios fs

const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Configuración
let AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-05-01-preview';

// Validar endpoint
if (!AZURE_OPENAI_ENDPOINT) {
  console.error('Error: La variable AZURE_OPENAI_ENDPOINT no está definida en el entorno.');
  process.exit(1);
}
AZURE_OPENAI_ENDPOINT = AZURE_OPENAI_ENDPOINT.trim();
if (!AZURE_OPENAI_ENDPOINT.startsWith('https://')) {
  console.error('Error: AZURE_OPENAI_ENDPOINT debe comenzar con https://');
  process.exit(1);
}
if (AZURE_OPENAI_ENDPOINT.endsWith('/')) {
  AZURE_OPENAI_ENDPOINT = AZURE_OPENAI_ENDPOINT.slice(0, -1);
}
const INPUT_FILE = path.join(__dirname, '../data_new.json');
const OUTPUT_FILE = path.join(__dirname, '../data_chunks_embedded.json');
const CHUNK_SIZE = 500; // caracteres
// En Azure OpenAI, el modelo se define por el deployment

// Función para dividir texto en chunks
function chunkText(text, size) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

// Función para obtener embedding de OpenAI
async function getEmbedding(text) {
  const url = `${AZURE_OPENAI_ENDPOINT}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/embeddings?api-version=${AZURE_OPENAI_API_VERSION}`;
  const response = await axios.post(
    url,
    {
      input: text
    },
    {
      headers: {
        'api-key': AZURE_OPENAI_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.data[0].embedding;
}

// Main
(async () => {
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  const output = [];

  for (const item of data) {
    const chunks = chunkText(item.ticket, CHUNK_SIZE);
    for (let idx = 0; idx < chunks.length; idx++) {
      const chunk = chunks[idx];
      try {
        const embedding = await getEmbedding(chunk);
        output.push({
          id: `${item.id}_${idx}`,
          original_id: item.id,
          chunk,
          embedding,
          category: item.category,
          sub_category: item.sub_category,
          label: item.label
        });
        console.log(`Procesado: ${item.id}_${idx}`);
      } catch (err) {
        console.error(`Error en chunk ${item.id}_${idx}:`, err.message);
        process.exit(1);
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log('Chunks y embeddings guardados en', OUTPUT_FILE);
})();
