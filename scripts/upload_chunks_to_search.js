// Script para subir los datos de data_chunks_embedded.json al índice de Azure Cognitive Search
// Requiere: npm install @azure/search-documents dotenv fs

require('dotenv').config();
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
const fs = require('fs');
const path = require('path');

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const apiKey = process.env.AZURE_SEARCH_API_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX || 'tickets-hr';
const dataFile = path.join(__dirname, '../data_chunks_embedded.json');

const client = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));

async function uploadDocuments() {
  const raw = fs.readFileSync(dataFile, 'utf8');
  let documents = JSON.parse(raw);

  // Adaptar los documentos al esquema del índice
  const allowedFields = [
    'id', 'ticket', 'category', 'sub_category', 'entity_start', 'entity_end', 'entity_label', 'label'
  ];
  documents = documents.map(doc => {
    // Renombrar chunk a ticket si existe
    if ('chunk' in doc) {
      doc.ticket = doc.chunk;
      delete doc.chunk;
    }
    // Eliminar campos no permitidos
    Object.keys(doc).forEach(key => {
      if (!allowedFields.includes(key)) {
        delete doc[key];
      }
    });
    return doc;
  });

  // Azure Cognitive Search recomienda lotes de hasta 1000 documentos
  const batchSize = 1000;
  let total = documents.length;
  let uploaded = 0;

  for (let i = 0; i < total; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    try {
      const result = await client.uploadDocuments(batch);
      uploaded += batch.length;
      console.log(`Subidos ${uploaded} de ${total} documentos`);
    } catch (err) {
      console.error('Error al subir documentos:', err.message);
      break;
    }
  }
  console.log('Carga finalizada.');
}

uploadDocuments();
