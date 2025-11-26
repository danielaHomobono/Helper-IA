const express = require('express');
const cors = require('cors');
const { BotFrameworkAdapter } = require('botbuilder');
const { HelperTeamsBot } = require('./teamsBot');
const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS dinámicamente para desarrollo y producción
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:3000'
    ];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Para poder recibir JSON desde el frontend
app.use(express.json());

// ==========================================
// CONFIGURACIÓN BOT DE TEAMS
// ==========================================

// Crear adaptador del bot - Sin autenticación para desarrollo
// NOTA: Para producción, se necesita Multi Tenant App ID
const adapter = new BotFrameworkAdapter({
  appId: '', // Vacío para desarrollo sin autenticación
  appPassword: '',
  channelAuthTenant: ''
});

// Deshabilitar autenticación para desarrollo
adapter.credentialsFactory = {
  createCredentials: async () => ({
    signRequest: async (req) => req,
    getToken: async () => ''
  })
};

// Manejo de errores del bot
adapter.onTurnError = async (context, error) => {
  console.error('❌ [BOT ERROR]', error);
  await context.sendActivity('⚠️ Hubo un error interno. Por favor intenta de nuevo.');
};

// Crear instancia del bot
const teamsBot = new HelperTeamsBot();

// ==========================================
// ENDPOINTS
// ==========================================

// Health check endpoint para Azure
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Endpoint para el frontend React
const phi4Router = require('./phi4');
app.use('/api', phi4Router);

// Endpoint para Microsoft Teams
app.post('/api/messages', async (req, res) => {
  console.log('📱 [TEAMS] Petición recibida');
  await adapter.process(req, res, async (context) => {
    await teamsBot.run(context);
  });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(port, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${port}`);
  console.log(`📱 Endpoint React: http://localhost:${port}/api/chat`);
  console.log(`🤖 Endpoint Teams: http://localhost:${port}/api/messages`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
