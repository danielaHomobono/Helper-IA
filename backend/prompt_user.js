// prompt_user.js
import { askJunior, askSenior } from "./phi4_models.js";

// Función simple de evaluación de confianza
function evaluarConfianza(respuesta) {
  // Aquí podés poner lógica real; para demo, simulamos
  // Si la respuesta contiene la palabra "no sé", baja confianza
  if (!respuesta || respuesta.toLowerCase().includes("no sé")) {
    return "baja";
  }
  return "alta";
}

// Función principal que recibe prompt y devuelve respuesta final
export async function procesarPrompt(prompt) {
  try {
    // Llamada al modelo junior
    const respuestaJunior = await askJunior(prompt);
    
    // Evaluar confianza
    const confianza = evaluarConfianza(respuestaJunior);

    if (confianza === "alta") {
      return { modelo: "junior", respuesta: respuestaJunior };
    } else {
      // Derivar a modelo senior
      const respuestaSenior = await askSenior(prompt);
      return { modelo: "senior", respuesta: respuestaSenior };
    }
  } catch (error) {
    console.error("Error en procesamiento de prompt:", error);
    return { modelo: "error", respuesta: "Ocurrió un error al procesar el prompt." };
  }
}

// Prueba rápida
async function main() {
  const prompt = "Hola, soy tu asistente. ¿Qué necesitas?";
  const resultado = await procesarPrompt(prompt);
  console.log("Resultado:", resultado);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
