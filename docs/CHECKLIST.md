# ✅ CHECKLIST COMPLETO - Helper IA

## 📋 FASE 1: DESARROLLO LOCAL (COMPLETADO ✅)

### Frontend
- [x] Estructura de proyecto React + Vite
- [x] Componentes de UI profesionales
  - [x] ChatPage con header gradient
  - [x] ChatWindow con welcome screen
  - [x] Message con avatares y badges
  - [x] MessageInput con contador y quick replies
- [x] React Icons integrados (bs, md, io5)
- [x] Tipografía Montserrat desde Google Fonts
- [x] CSS organizado en carpeta `/src/styles`
  - [x] index.css (variables globales)
  - [x] App.css
  - [x] components/ (ChatWindow, Message, MessageInput)
  - [x] pages/ (ChatPage)
- [x] Custom hooks (useChat)
- [x] API client configurado
- [x] Constants y endpoints definidos
- [x] Vite proxy configurado (puerto 7071)
- [x] Responsive design mobile-first
- [x] Animaciones y transiciones
- [x] Manejo de estados (loading, error)
- [x] package.json con dependencias

### Backend
- [x] Azure Functions v4 configurado
- [x] Endpoint POST /api/chat implementado
- [x] Integración OpenAI SDK
- [x] Prompts especializados (MASTER_PROMPT)
- [x] 5 categorías de consultas definidas
- [x] Sistema de confianza (confidence score)
- [x] Database client (Tedious para SQL Server)
- [x] Funciones de BD:
  - [x] saveConversation
  - [x] getConversationHistory
  - [x] updateMetrics
  - [x] logInteraction
  - [x] createTicket
  - [x] saveFeedback
- [x] Manejo de errores robusto
- [x] Logging con Azure context
- [x] host.json configurado
- [x] local.settings.json template
- [x] package.json con scripts
- [x] Script de deploy preparado

### Database
- [x] Schema SQL (6 tablas)
  - [x] conversations
  - [x] interactions
  - [x] escalation_tickets
  - [x] feedback
  - [x] metrics
  - [x] users
- [x] Stored procedures
  - [x] sp_SaveConversation
  - [x] sp_GetConversationHistory
  - [x] sp_LogInteraction
  - [x] sp_CreateTicket
  - [x] sp_SaveFeedback
  - [x] sp_UpdateMetrics
  - [x] sp_GetMetrics
- [x] Seed data (opcional)

### Git & Documentación
- [x] .gitignore completo (200+ líneas)
- [x] Commit inicial (28 archivos)
- [x] README.md profesional
- [x] Documentación de API
- [x] Estructura de carpetas organizada
- [x] Branch: arquitercture-dani

---

## 🔄 FASE 2: CONFIGURACIÓN Y TESTING LOCAL (EN PROCESO)

### Credenciales
- [ ] Obtener OpenAI API Key
  - [ ] Ir a https://platform.openai.com/api-keys
  - [ ] Crear nueva API key
  - [ ] Copiar key (se muestra solo una vez)
  - [ ] Pegar en `backend/local.settings.json`
  
- [ ] Configurar Base de Datos (elegir una opción)
  
  **Opción A: SQL Server Local**
  - [ ] Instalar SQL Server Express (gratis)
  - [ ] Instalar SQL Server Management Studio
  - [ ] Crear base de datos `helper_ia_db`
  - [ ] Ejecutar `database/schema/01_create_tables.sql`
  - [ ] Ejecutar `database/stored-procedures/01_core_procedures.sql`
  - [ ] (Opcional) Ejecutar `database/seed/01_sample_data.sql`
  - [ ] Actualizar credenciales en `backend/local.settings.json`
  
  **Opción B: Docker SQL Server**
  ```bash
  docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
    -p 1433:1433 --name sqlserver \
    -d mcr.microsoft.com/mssql/server:2022-latest
  ```
  
  **Opción C: Azure SQL Database**
  - [ ] Crear en Azure Portal
  - [ ] Tier: Basic (más económico)
  - [ ] Configurar firewall
  - [ ] Ejecutar scripts SQL
  - [ ] Actualizar connection string

### Testing Backend
- [ ] Verificar `backend/local.settings.json` con credenciales reales
- [ ] Instalar dependencias: `cd backend && npm install`
- [ ] Iniciar Azure Functions: `npm start`
- [ ] Verificar que corra en http://localhost:7071
- [ ] Probar health check (si existe)
- [ ] Probar con Postman/cURL:
  ```bash
  curl -X POST http://localhost:7071/api/chat \
    -H "Content-Type: application/json" \
    -d '{
      "message": "¿Cómo restablezco mi contraseña?",
      "conversationId": "test-local-123"
    }'
  ```
- [ ] Verificar respuesta JSON correcta
- [ ] Verificar logs en terminal
- [ ] Verificar guardado en base de datos

### Testing Frontend
- [ ] Instalar dependencias: `cd frontend && npm install`
- [ ] Iniciar dev server: `npm run dev`
- [ ] Abrir http://localhost:5173
- [ ] Verificar diseño Montserrat
- [ ] Verificar iconos React Icons
- [ ] Verificar welcome screen con 4 cards
- [ ] Probar envío de mensaje
- [ ] Verificar typing indicator
- [ ] Verificar respuesta de IA
- [ ] Verificar avatares, badges, confidence bar
- [ ] Verificar contador de caracteres
- [ ] Verificar quick replies
- [ ] Verificar responsive en mobile
- [ ] Verificar manejo de errores
- [ ] Probar botón "Limpiar"

### Testing End-to-End
- [ ] Backend corriendo en :7071
- [ ] Frontend corriendo en :5173
- [ ] Enviar mensaje desde UI
- [ ] Verificar request en backend logs
- [ ] Verificar llamada a OpenAI
- [ ] Verificar respuesta en frontend
- [ ] Verificar guardado en BD
- [ ] Probar múltiples mensajes (contexto)
- [ ] Probar todas las categorías:
  - [ ] PASSWORD_RESET
  - [ ] VACATION_INQUIRY
  - [ ] CERTIFICATE_REQUEST
  - [ ] POLICY_QUESTION
  - [ ] ESCALATE_TO_HUMAN

---

## ☁️ FASE 3: DEPLOY A AZURE (PENDIENTE ❌)

### Preparación Azure
- [ ] Crear cuenta Azure (o usar existente)
  - [ ] Ir a https://azure.microsoft.com/free/
  - [ ] $200 USD gratis + servicios free tier
  - [ ] Configurar billing (tarjeta requerida)

- [ ] Instalar Azure CLI
  ```bash
  # Windows
  winget install Microsoft.AzureCLI
  
  # Verificar
  az --version
  ```

- [ ] Login a Azure
  ```bash
  az login
  ```

### Crear Recursos en Azure

#### Resource Group
```bash
az group create \
  --name helper-ia-rg \
  --location eastus
```

#### Storage Account (requerido para Functions)
```bash
az storage account create \
  --name helperstorage123 \
  --resource-group helper-ia-rg \
  --location eastus \
  --sku Standard_LRS
```

#### Azure Function App
```bash
az functionapp create \
  --name helper-ia-functions \
  --resource-group helper-ia-rg \
  --storage-account helperstorage123 \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --consumption-plan-location eastus
```

#### Azure OpenAI Service
- [ ] En Azure Portal: Crear recurso > Azure OpenAI
- [ ] Nombre: `helper-ia-openai`
- [ ] Region: East US
- [ ] Pricing: Standard
- [ ] Deploy modelo: `gpt-4o-mini`
- [ ] Copiar API Key
- [ ] Copiar Endpoint

#### Azure SQL Database (Opcional)
```bash
# Crear SQL Server
az sql server create \
  --name helper-ia-sqlserver \
  --resource-group helper-ia-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password YourStrong@Passw0rd

# Crear Database
az sql db create \
  --name helper_ia_db \
  --server helper-ia-sqlserver \
  --resource-group helper-ia-rg \
  --service-objective Basic
```

### Configurar Application Settings
```bash
az functionapp config appsettings set \
  --name helper-ia-functions \
  --resource-group helper-ia-rg \
  --settings \
    "OPENAI_API_KEY=sk-..." \
    "OPENAI_ENDPOINT=https://helper-ia-openai.openai.azure.com/" \
    "SQL_SERVER=helper-ia-sqlserver.database.windows.net" \
    "SQL_USER=sqladmin" \
    "SQL_PASSWORD=YourStrong@Passw0rd" \
    "SQL_DATABASE=helper_ia_db"
```

### Deploy Backend
- [ ] En carpeta backend:
  ```bash
  npm run deploy
  # o
  func azure functionapp publish helper-ia-functions
  ```
- [ ] Verificar deploy exitoso
- [ ] Copiar URL de Function: `https://helper-ia-functions.azurewebsites.net`
- [ ] Probar endpoint:
  ```bash
  curl -X POST https://helper-ia-functions.azurewebsites.net/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Hola","conversationId":"test-azure"}'
  ```

### Deploy Frontend

#### Opción A: Azure Static Web Apps (Recomendado)
```bash
# Instalar SWA CLI
npm install -g @azure/static-web-apps-cli

# Deploy
cd frontend
npm run build
swa deploy ./dist \
  --app-name helper-ia-frontend \
  --resource-group helper-ia-rg
```

#### Opción B: Azure Storage Static Website
```bash
# Crear Storage Account
az storage account create \
  --name helperiastorage \
  --resource-group helper-ia-rg \
  --location eastus \
  --sku Standard_LRS

# Habilitar static website
az storage blob service-properties update \
  --account-name helperiastorage \
  --static-website \
  --index-document index.html

# Build y upload
cd frontend
npm run build
az storage blob upload-batch \
  --account-name helperiastorage \
  --source ./dist \
  --destination '$web'
```

### Configurar Frontend con Backend Azure
- [ ] Crear `.env.production` en frontend:
  ```
  VITE_API_URL=https://helper-ia-functions.azurewebsites.net
  ```
- [ ] Rebuild: `npm run build`
- [ ] Re-deploy frontend

### Testing en Azure
- [ ] Abrir URL de frontend
- [ ] Verificar carga correcta
- [ ] Enviar mensaje de prueba
- [ ] Verificar respuesta
- [ ] Revisar logs en Azure Portal
- [ ] Verificar Application Insights (opcional)

---

## 👥 FASE 4: MICROSOFT 365 / TEAMS (PENDIENTE ❌)

### Cuenta Microsoft 365
- [ ] Ir a https://www.microsoft.com/microsoft-365/enterprise/office-365-e3
- [ ] Iniciar trial 30 días gratis
- [ ] Configurar organización:
  - [ ] Nombre de empresa
  - [ ] Dominio: `tuempresa.onmicrosoft.com`
  - [ ] Admin email
  - [ ] Password
- [ ] Verificar email

### Configurar Tenant
- [ ] Login a Admin Center: https://admin.microsoft.com
- [ ] Setup > Domains > Verificar dominio (opcional)
- [ ] Users > Active users > Agregar usuarios del equipo
- [ ] Asignar licencias Microsoft 365

### Activar Teams
- [ ] Ya viene activado con M365
- [ ] Teams Admin Center: https://admin.teams.microsoft.com
- [ ] Policies > Messaging policies > Habilitar apps
- [ ] Apps > Manage apps > Allow custom apps

### Azure AD / Entra ID
- [ ] Azure Portal > Azure Active Directory
- [ ] App registrations > New registration
  - [ ] Name: "Helper IA Bot"
  - [ ] Supported account types: Single tenant
  - [ ] Redirect URI: (dejar en blanco por ahora)
- [ ] Copiar Application (client) ID
- [ ] Copiar Directory (tenant) ID
- [ ] Certificates & secrets > New client secret
  - [ ] Description: "Helper IA Secret"
  - [ ] Expires: 24 months
  - [ ] Copiar Value (solo se muestra una vez)
- [ ] API permissions > Add permission
  - [ ] Microsoft Graph
  - [ ] Application permissions:
    - [ ] User.Read.All
    - [ ] Chat.Read.All
    - [ ] Team.ReadBasic.All
  - [ ] Grant admin consent

### Crear Teams Bot (Desarrollo adicional requerido)
- [ ] Instalar Teams Toolkit: `npm install -g @microsoft/teamsfx-cli`
- [ ] Crear proyecto Teams App
- [ ] Configurar Bot Framework
- [ ] Crear manifest.json
- [ ] Integrar con Helper IA backend
- [ ] Sideload app a Teams
- [ ] Testing en Teams

---

## 📊 PROGRESO GENERAL

### ✅ COMPLETADO
- [x] Frontend (100%)
- [x] Backend Code (100%)
- [x] Database Scripts (100%)
- [x] Git Setup (100%)
- [x] Documentation (100%)
- [x] Estructura CSS Organizada (100%)

### 🔄 EN PROCESO (40%)
- [ ] Credenciales configuradas (0%)
- [ ] Testing local backend (0%)
- [ ] Testing local frontend (0%)
- [ ] Testing end-to-end (0%)

### ❌ PENDIENTE (0%)
- [ ] Deploy Azure (0%)
- [ ] Microsoft 365 (0%)
- [ ] Teams Integration (0%)

---

## 🎯 SIGUIENTE PASO INMEDIATO

**Recomendación**: Empezar con Testing Local

1. **Obtener OpenAI API Key** (15 min)
   - Ir a https://platform.openai.com/api-keys
   - Crear key
   - Pegar en `backend/local.settings.json`

2. **Configurar BD Simple** (30 min)
   - Instalar SQL Server Express
   - Crear base de datos
   - Ejecutar scripts

3. **Probar Backend** (15 min)
   - `cd backend && npm start`
   - Probar con cURL

4. **Probar Frontend** (10 min)
   - `cd frontend && npm run dev`
   - Enviar mensajes

**Total**: 70 minutos para tener todo funcionando localmente ✨

---

**Última actualización**: 23 Nov 2025  
**Progreso total**: 80%  
**Listo para**: Testing Local → Deploy Azure
