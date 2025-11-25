# 🚀 Guía de Deployment en Azure

Esta guía te llevará paso a paso para desplegar **Helper IA** en Azure usando **App Service** (backend) y **Static Web Apps** (frontend).

---

## 📋 Pre-requisitos

- [ ] Cuenta de Azure activa
- [ ] Azure CLI instalado ([Descargar aquí](https://docs.microsoft.com/cli/azure/install-azure-cli))
- [ ] Cuenta de GitHub (ya tenés el repo)
- [ ] Variables de entorno de Azure OpenAI:
  - `OPENAI_ENDPOINT`: https://helper-poject-resource.services.ai.azure.com
  - `OPENAI_API_KEY`: (tu API key)
  - `DEPLOYMENT_NAME`: Phi-4

---

## 🎯 Arquitectura del Deployment

```
┌─────────────────┐
│   GitHub Repo   │
│  (main branch)  │
└────────┬────────┘
         │
         ├─────────────────────┬──────────────────────┐
         │                     │                      │
         v                     v                      v
┌────────────────┐   ┌──────────────────┐   ┌─────────────────┐
│ GitHub Actions │   │ GitHub Actions   │   │   Azure CLI     │
│  (Backend CI)  │   │  (Frontend CI)   │   │ (Manual Deploy) │
└────────┬───────┘   └────────┬─────────┘   └────────┬────────┘
         │                    │                       │
         v                    v                       v
┌──────────────────┐   ┌───────────────────┐
│  Azure App       │   │  Azure Static     │
│  Service         │◄──┤  Web Apps         │
│  (Node.js)       │   │  (React/Vite)     │
└──────────────────┘   └───────────────────┘
         │
         v
┌──────────────────┐
│  Azure OpenAI    │
│  (Phi-4)         │
└──────────────────┘
```

---

## 📦 PARTE 1: Desplegar Backend (Azure App Service)

### Paso 1.1: Login en Azure

```bash
az login
```

### Paso 1.2: Crear Resource Group

```bash
az group create \
  --name helper-ia-rg \
  --location eastus
```

### Paso 1.3: Crear App Service Plan (Tier Gratis o B1)

```bash
# Opción 1: Free Tier (limitado pero gratis)
az appservice plan create \
  --name helper-ia-plan \
  --resource-group helper-ia-rg \
  --sku F1 \
  --is-linux

# Opción 2: Basic Tier (recomendado para producción)
az appservice plan create \
  --name helper-ia-plan \
  --resource-group helper-ia-rg \
  --sku B1 \
  --is-linux
```

### Paso 1.4: Crear Web App

```bash
az webapp create \
  --resource-group helper-ia-rg \
  --plan helper-ia-plan \
  --name helper-ia-backend \
  --runtime "NODE:18-lts"
```

### Paso 1.5: Configurar Variables de Entorno

```bash
az webapp config appsettings set \
  --resource-group helper-ia-rg \
  --name helper-ia-backend \
  --settings \
    OPENAI_ENDPOINT="https://helper-poject-resource.services.ai.azure.com" \
    OPENAI_API_KEY="TU_API_KEY_AQUI" \
    DEPLOYMENT_NAME="Phi-4" \
    ALLOWED_ORIGINS="https://tu-frontend.azurestaticapps.net,http://localhost:5173" \
    NODE_ENV="production"
```

⚠️ **IMPORTANTE**: Reemplazá `TU_API_KEY_AQUI` con tu key real.

### Paso 1.6: Configurar Deployment desde GitHub

#### Opción A: GitHub Actions (Recomendado - Automático)

1. Ve al portal de Azure: https://portal.azure.com
2. Navega a tu App Service `helper-ia-backend`
3. En el menú izquierdo, busca **Deployment Center**
4. Selecciona **GitHub** como fuente
5. Autoriza GitHub
6. Selecciona:
   - **Organization**: danielaHomobono
   - **Repository**: Helper-IA
   - **Branch**: main
7. Click en **Save**
8. Azure generará automáticamente un archivo `.yml` en `.github/workflows`

**Pero ya tenemos uno mejor**, así que:

1. En Azure Portal, en Deployment Center, click en **"Manage publish profile"**
2. Click **"Download publish profile"**
3. Abrí el archivo XML descargado y copiá TODO el contenido
4. Ve a tu repo en GitHub: https://github.com/danielaHomobono/Helper-IA
5. Settings → Secrets and variables → Actions
6. Click **"New repository secret"**
7. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
8. Value: (pegá el contenido del XML)
9. Click **"Add secret"**

#### Opción B: Deploy Manual (Para Testing)

```bash
cd backend
zip -r ../backend-deploy.zip .
az webapp deployment source config-zip \
  --resource-group helper-ia-rg \
  --name helper-ia-backend \
  --src ../backend-deploy.zip
```

### Paso 1.7: Verificar Backend

```bash
# Health check
curl https://helper-ia-backend.azurewebsites.net/health

# Test API
curl -X POST https://helper-ia-backend.azurewebsites.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hola"}'
```

Deberías ver: `{"status":"healthy","timestamp":"..."}`

---

## 🌐 PARTE 2: Desplegar Frontend (Azure Static Web Apps)

### Paso 2.1: Crear Static Web App

```bash
az staticwebapp create \
  --name helper-ia-frontend \
  --resource-group helper-ia-rg \
  --source https://github.com/danielaHomobono/Helper-IA \
  --location eastus2 \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist" \
  --login-with-github
```

**O desde el Portal de Azure** (más fácil):

1. Ve a https://portal.azure.com
2. Click **"Create a resource"**
3. Busca **"Static Web App"**
4. Click **Create**
5. Completa:
   - **Resource Group**: helper-ia-rg
   - **Name**: helper-ia-frontend
   - **Plan type**: Free
   - **Region**: East US 2
   - **Deployment details**:
     - Source: GitHub
     - Organization: danielaHomobono
     - Repository: Helper-IA
     - Branch: main
     - Build Presets: React
     - App location: `/frontend`
     - Api location: (dejar vacío)
     - Output location: `dist`
6. Click **Review + Create**
7. Click **Create**

### Paso 2.2: Obtener API Token

1. Una vez creado, ve al recurso **helper-ia-frontend**
2. En el menú izquierdo, click **"Manage deployment token"**
3. Copiá el token
4. Ve a GitHub: https://github.com/danielaHomobono/Helper-IA
5. Settings → Secrets and variables → Actions
6. Click **"New repository secret"**
7. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
8. Value: (pegá el token)
9. Click **"Add secret"**

### Paso 2.3: Configurar Variable de Entorno del Frontend

En GitHub Secrets, agregá también:

- Name: `VITE_API_URL`
- Value: `https://helper-ia-backend.azurewebsites.net`

### Paso 2.4: Actualizar CORS del Backend

Ahora que ya sabés la URL del frontend, actualizá el backend:

```bash
# Obtener la URL del frontend
az staticwebapp show \
  --name helper-ia-frontend \
  --resource-group helper-ia-rg \
  --query "defaultHostname" -o tsv
```

Te dará algo como: `helper-ia-frontend.azurestaticapps.net`

Ahora actualiza CORS:

```bash
az webapp config appsettings set \
  --resource-group helper-ia-rg \
  --name helper-ia-backend \
  --settings \
    ALLOWED_ORIGINS="https://helper-ia-frontend.azurestaticapps.net,http://localhost:5173"
```

### Paso 2.5: Trigger Deploy del Frontend

```bash
cd frontend
git add .
git commit -m "chore: trigger frontend deployment"
git push origin main
```

GitHub Actions detectará el cambio en `/frontend` y desplegará automáticamente.

### Paso 2.6: Verificar Frontend

1. Ve a: https://helper-ia-frontend.azurestaticapps.net
2. Abrí el chat
3. Enviá un mensaje
4. Deberías ver la respuesta de Phi-4

---

## 🔍 PARTE 3: Verificación y Troubleshooting

### Verificar que todo funciona:

```bash
# 1. Backend health
curl https://helper-ia-backend.azurewebsites.net/health

# 2. Backend API
curl -X POST https://helper-ia-backend.azurewebsites.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# 3. Frontend
curl https://helper-ia-frontend.azurestaticapps.net
```

### Ver logs del Backend:

```bash
# Stream de logs en tiempo real
az webapp log tail \
  --resource-group helper-ia-rg \
  --name helper-ia-backend
```

O desde el Portal:
1. Ve a tu App Service
2. Menú izquierdo → **Monitoring** → **Log stream**

### Ver logs del Frontend:

1. Ve a GitHub Actions: https://github.com/danielaHomobono/Helper-IA/actions
2. Click en el workflow más reciente
3. Revisa cada step

### Problemas comunes:

#### ❌ Error: "CORS policy"
**Solución**: Verificá que `ALLOWED_ORIGINS` incluya la URL del frontend

```bash
az webapp config appsettings show \
  --resource-group helper-ia-rg \
  --name helper-ia-backend \
  --query "[?name=='ALLOWED_ORIGINS'].value" -o tsv
```

#### ❌ Error: "Invalid Date" o "response is undefined"
**Solución**: Verificá que el backend esté retornando el formato correcto:

```bash
curl -X POST https://helper-ia-backend.azurewebsites.net/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}' | jq
```

Debe incluir: `response`, `timestamp`, `category`, etc.

#### ❌ Error: "Application failed to start"
**Solución**: 
1. Verificá que `web.config` esté en la raíz de `backend/`
2. Verificá que `package.json` tenga `"start": "node app.js"`
3. Verificá logs:

```bash
az webapp log tail --resource-group helper-ia-rg --name helper-ia-backend
```

#### ❌ Frontend no carga o da 404
**Solución**:
1. Verificá que el build de Vite haya sido exitoso en GitHub Actions
2. Verificá que `output_location: "dist"` esté correcto en el workflow
3. Verificá que `staticwebapp.config.json` esté en `/frontend`

---

## 📊 PARTE 4: Monitoreo y Mantenimiento

### Configurar Application Insights (Opcional pero Recomendado)

```bash
# Crear Application Insights
az monitor app-insights component create \
  --app helper-ia-insights \
  --location eastus \
  --resource-group helper-ia-rg

# Obtener Instrumentation Key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app helper-ia-insights \
  --resource-group helper-ia-rg \
  --query instrumentationKey -o tsv)

# Configurar en App Service
az webapp config appsettings set \
  --resource-group helper-ia-rg \
  --name helper-ia-backend \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

### Ver métricas:

```bash
# CPU, memoria, requests
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/helper-ia-rg/providers/Microsoft.Web/sites/helper-ia-backend \
  --metric-names "CpuPercentage,MemoryPercentage,Requests"
```

---

## 💰 Costos Estimados

| Recurso | Tier | Costo Mensual |
|---------|------|---------------|
| App Service | F1 (Free) | $0 |
| App Service | B1 (Basic) | ~$13 USD |
| Static Web App | Free | $0 |
| Azure OpenAI (Phi-4) | Free in preview | $0 |
| **TOTAL (Free tier)** | | **$0/mes** |
| **TOTAL (Basic tier)** | | **~$13/mes** |

---

## 🔒 Seguridad - Checklist

- [x] API Keys en **Application Settings** (no en código)
- [x] CORS configurado correctamente
- [x] `.env` en `.gitignore`
- [x] HTTPS forzado en Azure
- [x] Secrets de GitHub configurados
- [ ] (Opcional) Azure Key Vault para secrets
- [ ] (Opcional) Managed Identity para OpenAI

---

## 📝 Comandos Útiles

```bash
# Restart backend
az webapp restart --resource-group helper-ia-rg --name helper-ia-backend

# Ver estado
az webapp show --resource-group helper-ia-rg --name helper-ia-backend --query state

# Eliminar todo (cuidado!)
az group delete --name helper-ia-rg --yes

# Ver todos los recursos
az resource list --resource-group helper-ia-rg -o table
```

---

## 🎉 ¡Deployment Exitoso!

Si llegaste hasta acá, deberías tener:

✅ Backend funcionando en: `https://helper-ia-backend.azurewebsites.net`  
✅ Frontend funcionando en: `https://helper-ia-frontend.azurestaticapps.net`  
✅ CI/CD automático con GitHub Actions  
✅ Logs y monitoreo configurados  

---

## 📞 Soporte

- **Documentación Azure App Service**: https://docs.microsoft.com/azure/app-service/
- **Documentación Static Web Apps**: https://docs.microsoft.com/azure/static-web-apps/
- **GitHub Actions**: https://docs.github.com/actions

---

**¡Excelente trabajo! 🚀**
