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
