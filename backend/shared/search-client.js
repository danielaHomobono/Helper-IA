const axios = require('axios');

class CognitiveSearchClient {
  constructor() {
    this.endpoint = process.env.COGNITIVE_SEARCH_ENDPOINT;
    this.apiKey = process.env.COGNITIVE_SEARCH_API_KEY;
    this.indexName = process.env.COGNITIVE_SEARCH_INDEX || 'tickets-index';
    this.apiVersion = process.env.COGNITIVE_SEARCH_API_VERSION || '2024-07-01-Preview';
  }

  isConfigured() {
    return Boolean(this.endpoint && this.apiKey && this.indexName);
  }

  async searchTickets(query, options = {}) {
    if (!this.isConfigured()) {
      console.warn('⚠️ Cognitive Search no está configurado. Revisa tus variables de entorno.');
      return { results: [], total: 0 };
    }

    const payload = this.buildSearchPayload(query, options);
    const url = `${this.endpoint}/indexes/${this.indexName}/docs/search?api-version=${this.apiVersion}`;

    try {
      const { data } = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        timeout: options.timeout || 7000
      });

      const results = (data.value || []).map((doc) => ({
        ticketId: doc.ticket_id || doc.ticketId,
        description: doc.description,
        category: doc.category,
        subcategory: doc.subcategory,
        resolution: doc.resolution,
        status: doc.status,
        source: doc.source,
        score: doc['@search.score'],
        highlights: doc['@search.highlights']
      }));

      return {
        results,
        total: data['@odata.count'] || data.totalCount || results.length
      };
    } catch (error) {
      console.error('Error consultando Cognitive Search:', error.message);
      return { results: [], total: 0, error: error.message };
    }
  }

  buildSearchPayload(query, options) {
    const payload = {
      search: query || '*',
      top: options.top || 5,
      includeTotalResultCount: true,
      queryType: options.queryType || 'semantic',
      searchFields: options.searchFields || 'description,category,subcategory,resolution',
      semanticConfiguration: options.semanticConfiguration || process.env.COGNITIVE_SEARCH_SEMANTIC_CONFIG,
      select: options.select || 'ticket_id,description,category,subcategory,resolution,status,source',
      filter: options.filter
    };

    // Soporte opcional para vector search
    if (options.vector) {
      payload.vector = options.vector;
      payload.vectorFields = options.vectorFields || 'embedding';
      payload.top = options.top || 3;
    }

    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined && value !== null)
    );
  }
}

module.exports = { CognitiveSearchClient };

