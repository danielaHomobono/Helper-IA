const express = require('express');
const cors = require('cors');
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

// Health check endpoint para Azure
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Importamos el router de Phi-4
const phi4Router = require('./phi4');
app.use('/api', phi4Router);

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
