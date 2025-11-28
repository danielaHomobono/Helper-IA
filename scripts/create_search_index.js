// Script para crear el índice en Azure Cognitive Search con soporte para vector search
// Requiere: npm install @azure/search-documents dotenv fs

require('dotenv').config();
const { SearchIndexClient, AzureKeyCredential } = require('@azure/search-documents');

const endpoint = process.env.AZURE_SEARCH_ENDPOINT;
const apiKey = process.env.AZURE_SEARCH_API_KEY;
const indexName = process.env.AZURE_SEARCH_INDEX || 'tickets-hr';

const client = new SearchIndexClient(endpoint, new AzureKeyCredential(apiKey));

async function createIndex() {
  const indexSchema = {
    name: indexName,
    fields: [
      { name: 'id', type: 'Edm.String', key: true, filterable: true },
      { name: 'original_id', type: 'Edm.Int32', filterable: true },
      { name: 'chunk', type: 'Edm.String', searchable: true },
      { name: 'embedding', type: 'Collection(Edm.Single)', searchable: false, filterable: false, sortable: false, facetable: false },
      { name: 'category', type: 'Edm.String', filterable: true, facetable: true, searchable: true },
      { name: 'sub_category', type: 'Edm.String', filterable: true, facetable: true, searchable: true },
      { name: 'label', type: 'Edm.String', filterable: true, facetable: true, searchable: true }
    ],
    vectorSearch: {
      algorithms: [
        {
          name: 'vector-algorithm',
          kind: 'hnsw',
          parameters: {
            m: 4,
            efConstruction: 400,
            efSearch: 500
          }
        }
      ]
    }
  };

  try {
    await client.createIndex(indexSchema);
    console.log('Índice creado correctamente:', indexName);
  } catch (err) {
    if (err.statusCode === 409) {
      console.log('El índice ya existe:', indexName);
    } else {
      console.error('Error al crear el índice:', err.message);
    }
  }
}

createIndex();
