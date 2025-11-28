// confidence.js
module.exports = function evaluarConfianza(message) {
  if (!message) return { confianzaAlta: true, score: 100 };

  const texto = message.toLowerCase();

  // 1️⃣ Factor palabras sensibles
  const palabrasSensibles = ['error', 'problema', 'confidencial', 'riesgo', 'incidente'];
  const contienePalabraSensible = palabrasSensibles.some(palabra => texto.includes(palabra));
  let factorPalabra = contienePalabraSensible ? 0.4 : 1; // multiplica la confianza

  // 2️⃣ Factor longitud
  const len = texto.length;
  let factorLongitud = 1;
  if (len > 200) factorLongitud = 0.7;  // demasiado largo → menos confianza
  else if (len < 20) factorLongitud = 1; // corto → más confianza

  // 3️⃣ Factor signos de interrogación/exclamación
  const signos = (texto.match(/[!?]/g) || []).length;
  let factorSignos = 1 - Math.min(signos * 0.05, 0.2); // cada signo reduce 5%, máximo 20%

  // 4️⃣ Score final
  let score = Math.round(100 * factorPalabra * factorLongitud * factorSignos);

  // Confianza alta si > 70%
  const confianzaAlta = score > 70;

  return { confianzaAlta, score };
};
