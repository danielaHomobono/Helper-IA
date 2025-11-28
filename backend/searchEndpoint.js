// Endpoint Express para buscar en Azure Cognitive Search
// Requiere: npm install express @azure/search-documents dotenv

require('dotenv').config();
const express = require('express');
const { SearchClient, AzureKeyCredential } = require('@azure/search-documents');

const app = express();
const port = process.env.PORT || 3001;

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const apiKey = process.env.AZURE_SEARCH_API_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX || 'tickets-hr';

const client = new SearchClient(endpoint, indexName, new AzureKeyCredential(apiKey));

app.use(express.json());

app.post('/api/search', async (req, res) => {
  const query = req.body.query || '';
  try {
    const results = await client.search(query, {
      select: ['id', 'ticket', 'category', 'label'],
      top: 10
    });
    const docs = [];
    for await (const result of results.results) {
      docs.push(result.document);
    }
    res.json({ results: docs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`API de búsqueda escuchando en http://localhost:${port}`);
});
