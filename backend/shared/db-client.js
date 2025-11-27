const { Connection, Request, TYPES } = require('tedious');

const inferTediousType = (value) => {
  if (value === null || value === undefined) {
    return { type: TYPES.NVarChar, normalized: null };
  }

  if (value?.type && Object.prototype.hasOwnProperty.call(value, 'value')) {
    return { type: value.type, normalized: value.value };
  }

  if (value instanceof Date) {
    return { type: TYPES.DateTime, normalized: value };
  }

  switch (typeof value) {
    case 'number':
      if (Number.isInteger(value)) {
        return { type: TYPES.Int, normalized: value };
      }
      return { type: TYPES.Float, normalized: value };
    case 'boolean':
      return { type: TYPES.Bit, normalized: value };
    default:
      return { type: TYPES.NVarChar, normalized: value };
  }
};

const addParameterToRequest = (request, name, value) => {
  const { type, normalized } = inferTediousType(value);
  request.addParameter(name, type, normalized);
};

class DatabaseClient {
  constructor() {
    this.config = {
      server: process.env.SQL_SERVER,
      authentication: {
        type: 'default',
        options: {
          userName: process.env.SQL_USER,
          password: process.env.SQL_PASSWORD
        }
      },
      options: {
        database: process.env.SQL_DATABASE,
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 15000
      }
    };
    this.connection = null;
  }

  async connect() {
    if (this.connection && this.connection.STATE.LoggedIn) {
      return this.connection;
    }

    return new Promise((resolve, reject) => {
      this.connection = new Connection(this.config);
      
      this.connection.on('connect', (err) => {
        if (err) {
          console.error('Database connection failed:', err);
          reject(err);
        } else {
          console.log('Database connected');
          resolve(this.connection);
        }
      });

      this.connection.connect();
    });
  }

  async query(sql, params = []) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const rows = [];
      const request = new Request(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });

      // Agregar parámetros
      params.forEach((param, index) => {
        addParameterToRequest(request, `param${index}`, param);
      });

      request.on('row', (columns) => {
        const row = {};
        columns.forEach((column) => {
          row[column.metadata.colName] = column.value;
        });
        rows.push(row);
      });

      this.connection.execSql(request);
    });
  }

  async executeStoredProcedure(procedureName, parameters = {}) {
    await this.connect();
    
    return new Promise((resolve, reject) => {
      const rows = [];
      const request = new Request(procedureName, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ recordset: rows });
        }
      });

      // Agregar parámetros
      Object.keys(parameters).forEach(key => {
        addParameterToRequest(request, key, parameters[key]);
      });

      request.on('row', (columns) => {
        const row = {};
        columns.forEach((column) => {
          row[column.metadata.colName] = column.value;
        });
        rows.push(row);
      });

      this.connection.callProcedure(request);
    });
  }

  // Guardar conversación
  async saveConversation(data) {
    try {
      const sql = `
        INSERT INTO conversations (
          session_id, user_message, ai_response, timestamp, 
          confidence_score, category, escalated
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        data.sessionId,
        data.userMessage,
        data.aiResponse,
        new Date(),
        data.confidenceScore || null,
        data.category || null,
        data.escalated || false
      ];
      
      const result = await this.query(sql, params);
      return result;
      
    } catch (error) {
      console.error('Error guardando conversación:', error);
      throw error;
    }
  }

  // Registrar interacción
  async logInteraction({
    conversationId,
    userId,
    message,
    timestamp,
    type,
    metadata = null
  }) {
    const parameters = {
      conversationId: conversationId || null,
      userId: userId || null,
      message,
      timestamp,
      type,
      metadata: metadata ? JSON.stringify(metadata) : null
    };

    try {
      const result = await this.executeStoredProcedure('sp_log_interaction', parameters);
      return result.recordset[0].interactionId;
    } catch (error) {
      console.error('Error registrando interacción:', error);
      throw error;
    }
  }

  // Obtener historial de conversación
  async getConversationHistory(conversationId, limit = 20) {
    if (!conversationId) return [];

    const sql = `
      SELECT TOP (?)
        message,
        type,
        timestamp,
        metadata
      FROM interactions 
      WHERE conversationId = ? 
      ORDER BY timestamp ASC
    `;

    try {
      const result = await this.query(sql, [limit, conversationId]);
      
      return result.map(row => ({
        message: row.message,
        type: row.type,
        timestamp: row.timestamp,
        metadata: row.metadata ? JSON.parse(row.metadata) : null
      }));
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  // Crear ticket de escalación
  async createTicket(ticketData) {
    const parameters = {
      conversationId: ticketData.conversationId,
      interactionId: ticketData.interactionId,
      priority: ticketData.priority,
      category: ticketData.category,
      reason: ticketData.reason,
      urgency: ticketData.urgency,
      complexity: ticketData.complexity,
      riskLevel: ticketData.riskLevel,
      requiredSkills: ticketData.requiredSkills,
      estimatedResolutionTime: ticketData.estimatedResolutionTime,
      status: ticketData.status,
      createdAt: ticketData.createdAt
    };

    try {
      const result = await this.executeStoredProcedure('sp_create_ticket', parameters);
      return result.recordset[0].ticketId;
    } catch (error) {
      console.error('Error creando ticket:', error);
      throw error;
    }
  }

  // Guardar feedback
  async saveFeedbackRating({ conversationId = null, interactionId, rating, comment, metadata = null }) {
    const parameters = {
      conversationId,
      interactionId,
      rating,
      comment: comment || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      timestamp: new Date()
    };

    try {
      const result = await this.executeStoredProcedure('sp_save_feedback', parameters);
      return result.recordset[0].feedbackId;
    } catch (error) {
      console.error('Error guardando feedback:', error);
      throw error;
    }
  }

  // Actualizar métricas
  async updateMetrics({
    conversationId,
    responseTime,
    category,
    intent,
    confidence
  }) {
    const parameters = {
      conversationId,
      responseTime,
      category,
      intent,
      confidence,
      timestamp: new Date()
    };

    try {
      await this.executeStoredProcedure('sp_update_metrics', parameters);
    } catch (error) {
      console.error('Error actualizando métricas:', error);
      // No lanzar error para no bloquear el flujo principal
    }
  }

  // Obtener métricas del dashboard
  async getMetrics() {
    try {
      const result = await this.executeStoredProcedure('sp_get_metrics', {});
      
      if (result.recordset.length === 0) {
        return this.getDefaultMetrics();
      }

      return result.recordset[0];
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return this.getDefaultMetrics();
    }
  }

  // Métricas por defecto en caso de error
  getDefaultMetrics() {
    return {
      conversationsToday: 0,
      satisfactionRate: 0,
      avgResponseTime: 0,
      escalatedCases: 0,
      activeUsers: 0,
      autoResolutionRate: 0
    };
  }

  // Verificar salud de la conexión
  async healthCheck() {
    try {
      const result = await this.query('SELECT 1 as health');
      return result[0].health === 1;
    } catch (error) {
      console.error('Health check falló:', error);
      return false;
    }
  }

  // Cerrar conexión
  async disconnect() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
      console.log('Database disconnected');
    }
  }

  // Limpiar conexiones inactivas
  async cleanup() {
    try {
      await this.disconnect();
    } catch (error) {
      console.error('Error en cleanup:', error);
    }
  }
}

module.exports = { DatabaseClient };