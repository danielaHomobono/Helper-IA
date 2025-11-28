const express = require('express');
const router = express.Router();
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');
require('dotenv').config();

// Configuración de Azure Cognitive Search
const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const indexName = process.env.AZURE_SEARCH_INDEX;
const apiKey = process.env.AZURE_SEARCH_API_KEY;
console.log('API KEY:', apiKey);

const client = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));

// Endpoint POST /api/search
router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro query' });
  }
  try {
    const results = await client.search(query, {
      top: 10 // Número máximo de resultados
    });
    const docs = [];
    for await (const result of results.results) {
      docs.push(result.document);
    }
    res.json({ results: docs });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error al buscar en Azure Cognitive Search' });
  }
});

module.exports = router;
