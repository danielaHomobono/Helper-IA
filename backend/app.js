const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));

// Para poder recibir JSON desde el frontend
app.use(express.json());

// Importamos el router de Phi-4
const phi4Router = require('./phi4');
app.use('/api', phi4Router);

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
