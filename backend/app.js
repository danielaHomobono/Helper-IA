const express = require('express');
const cors = require('cors');   // ⬅️ agregar esto

const app = express();
const port = process.env.PORT || 3000;

// ⬅️ habilitar CORS antes del router
app.use(cors({
  origin: 'http://localhost:5175',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Para poder recibir JSON desde el frontend
app.use(express.json());

// Importamos el router de Phi-4
const phi4Router = require('./phi4');
app.use('/api', phi4Router);

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
