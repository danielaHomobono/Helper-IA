const tokenize = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/\b[a-z0-9]{4,}\b/g) || [];

const buildKnowledgeSummary = (documents = []) => {
  if (!documents.length) {
    return 'No se encontró evidencia relevante en el dataset histórico.';
  }

  return documents
    .slice(0, 5)
    .map((doc, index) => {
      const resolution = doc.resolution ? `Resolución sugerida: ${doc.resolution}` : '';
      return `${index + 1}. Ticket ${doc.ticketId || doc.ticket_id} (${doc.category || 'SIN_CATEGORIA'}):
Pregunta: ${doc.description}
${resolution}`;
    })
    .join('\n---\n');
};

const validateAnswerAgainstDocuments = ({ question, answer, documents = [] }) => {
  if (!documents.length) {
    return {
      confidence: 'low',
      reason: 'No hay evidencia cargada en Cognitive Search',
      supportingDocuments: []
    };
  }

  const keywords = Array.from(new Set([...tokenize(question), ...tokenize(answer)]));
  const supportingDocuments = documents.filter((doc) => {
    const haystack = [
      doc.description,
      doc.resolution,
      doc.category,
      doc.subcategory
    ]
      .join(' ')
      .toLowerCase();

    return keywords.some((keyword) => haystack.includes(keyword));
  });

  const confidenceLevel =
    supportingDocuments.length >= 3
      ? 'high'
      : supportingDocuments.length >= 1
        ? 'medium'
        : 'low';

  return {
    confidence: confidenceLevel,
    reason:
      confidenceLevel === 'low'
        ? 'La respuesta no está respaldada por los tickets recuperados'
        : 'La respuesta se alinea con los tickets de soporte históricos',
    supportingDocuments: supportingDocuments.slice(0, 3).map((doc) => ({
      ticketId: doc.ticketId || doc.ticket_id,
      category: doc.category,
      score: Number(doc.score || 0).toFixed(2),
      snippet: (doc.description || '').slice(0, 180)
    }))
  };
};

module.exports = {
  buildKnowledgeSummary,
  validateAnswerAgainstDocuments
};

