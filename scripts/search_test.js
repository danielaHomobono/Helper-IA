// Script para probar una consulta de búsqueda en Azure Cognitive Search
// Requiere: npm install @azure/search-documents dotenv

require('dotenv').config();
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const apiKey = process.env.AZURE_SEARCH_API_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX || 'tickets-hr';

const client = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));

async function searchTest() {
  const query = 'salary'; // Cambia esto por el término que quieras buscar
  try {
    const results = await client.search(query, {
      select: ['id', 'ticket', 'category', 'label'],
      top: 5
    });
    console.log('Resultados de búsqueda:');
    for await (const result of results.results) {
      console.log(result.document);
    }
  } catch (err) {
    console.error('Error en la búsqueda:', err.message);
  }
}

searchTest();
