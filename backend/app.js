const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Para poder recibir JSON desde el frontend
app.use(express.json());

// Importamos el router de Phi-4
const phi4Router = require('./phi4');
app.use('/api', phi4Router);

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
