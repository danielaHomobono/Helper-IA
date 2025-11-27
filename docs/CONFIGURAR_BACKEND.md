# ⚙️ CONFIGURACIÓN DEL BACKEND

## 🔑 OPCIÓN 1: Usar OpenAI (Recomendado para empezar)

### 1. Obtener API Key de OpenAI

1. Ir a: https://platform.openai.com/api-keys
2. Crear cuenta (si no tienes)
3. Click en "Create new secret key"
4. Copiar la key (se muestra solo una vez!)
5. Pegar en `backend/local.settings.json`

### 2. Actualizar local.settings.json

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "OPENAI_API_KEY": "sk-proj-XXXX-tu-key-aquí",  // ← Pegar aquí
    "OPENAI_MODEL": "gpt-3.5-turbo",  // ← Agregar esto
    "SQL_SERVER": "localhost",
    "SQL_USER": "sa",
    "SQL_PASSWORD": "your-password",
    "SQL_DATABASE": "helper_ia_db",
    "ENVIRONMENT": "development"
  }
}
```

**Costos OpenAI:**
- Trial: $5 USD gratis
- gpt-3.5-turbo: ~$0.002 por 1K tokens (muy barato)
- gpt-4o-mini: ~$0.00015 por 1K tokens (súper barato)

---

## 🔑 OPCIÓN 2: Usar Azure OpenAI (Más complejo)

Si tienes cuenta Azure:

1. Crear recurso Azure OpenAI en portal
2. Deploy modelo gpt-4o-mini
3. Copiar endpoint y key
4. Actualizar local.settings.json:

```json
{
  "OPENAI_API_KEY": "tu-azure-openai-key",
  "OPENAI_ENDPOINT": "https://tu-instance.openai.azure.com/",
  "OPENAI_MODEL": "gpt-4o-mini"
}
```

---

## 🗄️ BASE DE DATOS (Opcional por ahora)

### OPCIÓN A: Sin base de datos (Temporal)

Para probar rápido, puedes comentar el código de BD:

1. Abrir `backend/chat/index.js`
2. Comentar líneas de base de datos:

```javascript
// Comentar estas líneas temporalmente:
// const db = new DatabaseClient();
// const history = await db.getConversationHistory(conversationId);
// await db.saveConversation({...});
// await db.updateMetrics({...});
```

### OPCIÓN B: SQL Server Local

1. Instalar SQL Server Express (gratis)
2. Crear base de datos `helper_ia_db`
3. Ejecutar scripts en `/database/schema/`
4. Actualizar credenciales en `local.settings.json`

### OPCIÓN C: Azure SQL Database
1. Crear en Azure Portal
2. Ejecutar scripts SQL
3. Actualizar connection string

---

## 🧠 ETAPA 2 – Learning & Validation

Para esta etapa necesitamos que el backend registre feedback y valide respuestas con datos reales.

### 1. Azure SQL Serverless (General Purpose)
1. Crea un **SQL Server** y una **Base de datos Serverless** (GP_S_Gen5_1 es suficiente para hackathon).
2. Activa *auto-pause* ≥ 1h para no pagar cuando no se use.
3. Ejecuta:
   - `database/schema/01_create_tables.sql`
   - `database/stored-procedures/01_core_procedures.sql`
4. Carga tus 1000 tickets:
   - Copia el CSV a tu storage / disco.
   - Edita la ruta en `database/seed/02_load_tickets.sql`.
   - Ejecuta el script (usa `02_tickets_sample.csv` como referencia).
5. Anota servidor, usuario y password para `local.settings.json` o para el Function App.

### 2. Azure Cognitive Search (Free tier si está disponible)
1. Crea un recurso **Cognitive Search** (SKU Free o Basic).
2. Carga el dataset desde SQL o CSV y crea un índice `tickets-index` con campos:
   - `ticket_id` (Key)
   - `description`, `resolution` (searchable/content)
   - `category`, `subcategory`, `status`, `source`
   - `embedding` (opcional si quieres vector search)
3. (Opcional) Crea configuración semántica para mejores resultados.
4. Guarda **endpoint**, **API key** y **index name** para las variables de entorno.

### 3. Variables nuevas del backend
```json
{
  "COGNITIVE_SEARCH_ENDPOINT": "https://tuinstancia.search.windows.net",
  "COGNITIVE_SEARCH_API_KEY": "api-key-admin",
  "COGNITIVE_SEARCH_INDEX": "tickets-index",
  "COGNITIVE_SEARCH_API_VERSION": "2024-07-01-Preview"
}
```

### 4. Nuevos endpoints (Function App)
| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/interaction` | POST | Usa OpenAI + Cognitive Search y guarda la interacción |
| `/api/feedback` | POST | Registra un rating 1-3 asociado al `interactionId` |

**Ejemplo /api/interaction**
```jsonc
{
  "message": "Necesito mi saldo de vacaciones",
  "conversationId": "uuid-123"
}
```

Respuesta:
```jsonc
{
  "response": "Puedes consultar tu saldo en ...",
  "interactionId": 42,
  "validation": {
    "confidence": "high",
    "reason": "Coincide con el ticket TCK-0002",
    "supportingDocuments": [
      { "ticketId": "TCK-0002", "score": "1.12" }
    ]
  },
  "sources": [
    { "ticketId": "TCK-0002", "category": "VACATIONS", "snippet": "..." }
  ]
}
```

**Ejemplo /api/feedback**
```json
{
  "interactionId": 42,
  "conversationId": "uuid-123",
  "rating": 3,
  "comment": "Respuesta perfecta"
}
```

---

## 🚀 CORRER EL BACKEND

Una vez configurada la API key:

```bash
cd backend
npm start
```

O con más detalles:

```bash
npm run dev
```

**El backend correrá en:**
```
http://localhost:7071
```

---

## ✅ PROBAR QUE FUNCIONA

### 1. Verificar que el servidor corre

Deberías ver en la terminal:

```
Functions:
  chat: [POST] http://localhost:7071/api/chat
```

### 2. Probar con cURL

```bash
curl -X POST http://localhost:7071/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hola\",\"conversationId\":\"test-123\"}"
```

### 3. Probar con Postman

- Método: POST
- URL: `http://localhost:7071/api/chat`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "message": "¿Cómo restablezco mi contraseña?",
  "conversationId": "test-456",
  "userId": "daniela"
}
```

**Respuesta esperada:**
```json
{
  "response": "Para restablecer tu contraseña...",
  "category": "PASSWORD_RESET",
  "confidence": 0.95,
  "suggestedActions": [...],
  "escalate": false,
  "conversationId": "test-456",
  "timestamp": "2025-11-25T..."
}
```

---

## 🐛 TROUBLESHOOTING

### Error: "OPENAI_API_KEY is not defined"
✅ Verifica que copiaste la key en `local.settings.json`

### Error: "Cannot connect to database"
✅ Comenta código de BD temporalmente o configura SQL Server

### Error: "Port 7071 is already in use"
```bash
# Matar proceso en el puerto
netstat -ano | findstr :7071
taskkill /PID <numero-proceso> /F
```

### Error: "Module not found"
```bash
cd backend
npm install
```

---

## 📝 RESUMEN RÁPIDO

**Para empezar rápido (5 minutos):**

1. ✅ Azure Functions instalado
2. ⏳ Conseguir OpenAI API key (https://platform.openai.com/api-keys)
3. ⏳ Pegar key en `backend/local.settings.json`
4. ⏳ Comentar código de base de datos (temporal)
5. ⏳ Ejecutar: `cd backend && npm start`
6. ✅ Probar en http://localhost:7071/api/chat

**¿Listo?** 🚀
