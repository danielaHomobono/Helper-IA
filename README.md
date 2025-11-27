# Helper IA 🤖# Proyecto Hackathon - Grupo 6 🚀



Sistema de asistente virtual inteligente para Service Desk de Recursos Humanos, desarrollado con Azure Functions, OpenAI y React.¡Bienvenido/a al repositorio de nuestro proyecto para la Hackathon!



## 📋 Descripción del Proyecto## 📝 Descripción del Proyecto



Helper IA es un chatbot especializado que ayuda a los empleados con consultas comunes de RH:*(Aquí pueden escribir una breve descripción de la idea. ¿Qué problema resuelve? ¿Cuál es el objetivo principal?)*

- 🔑 Restablecimiento de contraseñas

- 🏖️ Consultas sobre vacacionesEjemplo: "Helper-IA es una aplicación que busca [objetivo de la aplicación] utilizando [tecnología principal] para ayudar a los usuarios a [beneficio principal]."

- 📄 Solicitudes de constancias laborales

- 📋 Preguntas sobre políticas de RH## 🧑‍💻 Integrantes del Equipo

- 🆘 Escalación a agentes humanos cuando es necesario

*   Daniela Homobono

## 🏗️ Arquitectura*   *(Nombre del compañero 2)*

*   *(Nombre del compañero 3)*

```*   *(etc...)*

Helper IA/

├── backend/              # Azure Functions (Node.js)## 🛠️ Tecnologías Utilizadas

│   ├── chat/            # Función principal de chat

│   ├── shared/          # Utilidades compartidasAquí listaremos las tecnologías, lenguajes y herramientas que usaremos en el proyecto:

│   │   ├── prompts.js   # ❤️ Corazón de la IA

│   │   └── db-client.js # Cliente de base de datos*   **Frontend:** *(Ej: React, Vue, HTML, CSS)*

│   └── package.json*   **Backend:** *(Ej: Node.js, Python, Java)*

├── frontend/            # React con Vite*   **Base de Datos:** *(Ej: MongoDB, PostgreSQL)*

│   ├── src/*   **Otros:** *(Ej: APIs, librerías específicas)*

│   │   ├── components/  # Componentes React

│   │   ├── pages/       # Páginas## 🚀 Cómo Empezar

│   │   ├── hooks/       # Custom hooks

│   │   └── utils/       # UtilidadesInstrucciones para que cualquier miembro del equipo pueda clonar y ejecutar el proyecto en su máquina local.

│   └── package.json

├── database/            # SQL Server1.  Clona el repositorio:

│   ├── schema/          # Esquemas de tablas    ```bash

│   ├── stored-procedures/    git clone https://github.com/danielaHomobono/Helper-IA.git

│   └── seed/            # Datos de ejemplo    ```

└── docs/                # Documentación2.  Navega a la carpeta del proyecto:

```    ```bash

    cd Helper-IA

## 🚀 Tecnologías Utilizadas    ```

3.  *(Añadir más pasos a futuro, como `npm install`, etc.)*

### Backend
- **Azure Functions** (Serverless)
- **Node.js 18+**
- **OpenAI API** (gpt-4o-mini)
- **Tedious** (SQL Server driver)
- **SQL Server** (Base de datos)

### Frontend
- **React 18**
- **Vite** (Build tool)
- **CSS Modules**
- **Fetch API**

## 📦 Instalación

### Prerrequisitos
- Node.js 18 o superior
- SQL Server (local o Azure)
- Azure Functions Core Tools
- Cuenta de OpenAI con API key

### Backend Setup

```bash
# Ir al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar backend/local.settings.json con tus credenciales

# Iniciar Azure Functions
npm start
```

### Frontend Setup

```bash
# Ir al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### Database Setup

```bash
# Ejecutar scripts SQL en orden:
# 1. database/schema/01_create_tables.sql
# 2. database/stored-procedures/01_core_procedures.sql
# 3. database/seed/01_sample_data.sql (opcional)
```

## ⚙️ Configuración

### Backend (local.settings.json)

```json
{
  "Values": {
    "OPENAI_API_KEY": "tu-api-key-aquí",
    "SQL_SERVER": "localhost",
    "SQL_USER": "sa",
    "SQL_PASSWORD": "tu-password",
    "SQL_DATABASE": "helper_ia_db"
  }
}
```

## 🎯 Características Principales

### ✅ Respuestas Inteligentes
- Sistema de prompts especializado en RH
- Categorización automática de consultas
- Respuestas en formato JSON estructurado
- Confianza score para cada respuesta

### ✅ Escalación Inteligente
- Detección automática de casos complejos
- Criterios configurables de escalación
- Sistema de tickets para seguimiento

### ✅ Análisis y Métricas
- Dashboard de métricas en tiempo real
- Tasa de satisfacción
- Tiempo de respuesta promedio
- Casos escalados vs resueltos

### ✅ Historial Contextual
- Mantiene contexto de conversación
- Respuestas personalizadas según historial

## 📊 API Endpoints

### POST /api/chat
Enviar mensaje al chatbot

```json
{
  "message": "¿Cómo restablezco mi contraseña?",
  "conversationId": "uuid-here",
  "userId": "optional-user-id"
}
```

Respuesta:
```json
{
  "response": "Para restablecer tu contraseña...",
  "category": "PASSWORD_RESET",
  "confidence": 0.95,
  "suggestedActions": ["Acción 1", "Acción 2"],
  "escalate": false,
  "timestamp": "2025-11-22T..."
}
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📱 Uso

1. Abre la aplicación en `http://localhost:3000`
2. Escribe tu consulta en el chat
3. Recibe respuesta inmediata de Helper IA
4. Sigue las acciones sugeridas si las hay
5. Da feedback (útil/no útil) para mejorar el sistema

## 👥 Equipo

- **Daniela Homobono** - Developer
- **Fernando Mubarqui** - Data Science/IA Engineer

## 📄 Licencia

MIT License

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte, contacta al equipo de desarrollo o abre un issue en GitHub.

---

**Desarrollado con ❤️ para la Hackathon - Grupo 6**
