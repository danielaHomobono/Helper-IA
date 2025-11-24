# 🚀 Deploy Frontend a Azure Static Web Apps

## ✅ CAMBIOS REALIZADOS

### 1. **Corregido main.jsx** ✅
- ❌ Eliminada sintaxis CRA (`ReactDOM.createRoot`)
- ✅ Implementada sintaxis Vite (`createRoot` de 'react-dom/client')

### 2. **Archivos para Azure creados** ✅
- ✅ `staticwebapp.config.json` - Configuración de rutas
- ✅ `.github/workflows/azure-static-web-apps.yml` - CI/CD automático

### 3. **package.json actualizado** ✅
- ✅ Agregado script `deploy`

---

## 📋 PASOS PARA DEPLOY A AZURE

### Opción A: Deploy Manual (Rápido)

```bash
# 1. Build del proyecto
cd frontend
npm run build

# 2. Instalar Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# 3. Login a Azure
az login

# 4. Deploy
swa deploy ./dist \
  --app-name helper-ia-frontend \
  --resource-group helper-ia-rg \
  --env production
```

### Opción B: Deploy con Portal Azure (Manual)

1. **Crear Static Web App en Azure Portal**
   - Ir a: https://portal.azure.com
   - Crear recurso > Static Web App
   - Nombre: `helper-ia-frontend`
   - Region: East US (o la más cercana)
   - Deployment: GitHub (conectar tu repo)
   - Branch: `arquitercture-dani`
   - Build Details:
     - Build Presets: `Custom`
     - App location: `/frontend`
     - Output location: `dist`

2. **Azure configurará automáticamente el GitHub Action**
   - Se creará el workflow en `.github/workflows/`
   - Agregará el secret `AZURE_STATIC_WEB_APPS_API_TOKEN`

3. **Push y deploy automático**
   ```bash
   git add .
   git commit -m "fix: Corregir sintaxis Vite y agregar config Azure"
   git push origin arquitercture-dani
   ```

4. **Verificar**
   - GitHub Actions > Ver el workflow corriendo
   - Azure Portal > Tu Static Web App > Ver URL

### Opción C: Deploy con Azure CLI (Automatizado)

```bash
# 1. Crear Resource Group (si no existe)
az group create \
  --name helper-ia-rg \
  --location eastus

# 2. Crear Static Web App
az staticwebapp create \
  --name helper-ia-frontend \
  --resource-group helper-ia-rg \
  --location eastus \
  --source https://github.com/danielaHomobono/Helper-IA \
  --branch arquitercture-dani \
  --app-location "/frontend" \
  --output-location "dist" \
  --login-with-github

# 3. Obtener URL
az staticwebapp show \
  --name helper-ia-frontend \
  --resource-group helper-ia-rg \
  --query "defaultHostname" \
  --output tsv
```

---

## 🔧 CONFIGURACIÓN DE BACKEND

Una vez desplegado el frontend, necesitas configurar la URL del backend:

### Opción 1: Variables de entorno en Azure
```bash
az staticwebapp appsettings set \
  --name helper-ia-frontend \
  --resource-group helper-ia-rg \
  --setting-names VITE_API_URL=https://helper-ia-functions.azurewebsites.net
```

### Opción 2: Archivo .env.production
```env
# frontend/.env.production
VITE_API_URL=https://helper-ia-functions.azurewebsites.net
```

Luego rebuild y redeploy:
```bash
npm run build
swa deploy ./dist
```

---

## ✅ VERIFICAR DEPLOY

1. **Obtener URL del Static Web App**
   ```bash
   az staticwebapp show \
     --name helper-ia-frontend \
     --query "defaultHostname" -o tsv
   ```

2. **Abrir en navegador**
   - URL será algo como: `https://helper-ia-frontend-xyz123.azurestaticapps.net`

3. **Verificar que funciona**
   - ✅ UI carga correctamente
   - ✅ Montserrat aplicada
   - ✅ React Icons visibles
   - ✅ Welcome screen con 4 cards
   - ⚠️ Backend aún no conectado (hasta que despliegues Function App)

---

## 🔗 CONECTAR CON BACKEND

**IMPORTANTE**: El frontend necesita que el backend esté desplegado primero.

### Si backend NO está en Azure todavía:

1. **Opción A: Apuntar a local (temporal)**
   ```javascript
   // frontend/src/utils/constants.js
   export const API_BASE_URL = 'http://localhost:7071';
   ```

2. **Opción B: Deploy backend primero**
   - Ver instrucciones en `/docs/CHECKLIST.md` sección "Deploy Backend"
   - Luego actualizar `VITE_API_URL` con la URL de Azure Functions

---

## 🐛 TROUBLESHOOTING

### Error: "ReactDOM is not defined"
✅ **YA CORREGIDO** - Cambiamos sintaxis CRA por Vite en `main.jsx`

### Error: "Cannot find module './App'"
✅ **YA CORREGIDO** - Agregamos extensión `.jsx` en import

### Build falla en Azure
- Verificar `staticwebapp.config.json` en raíz de frontend
- Verificar que `app_location` es `/frontend` en workflow

### Frontend carga pero no conecta con backend
- Backend debe estar desplegado primero
- Configurar `VITE_API_URL` correctamente
- Verificar CORS en backend (debe permitir origen de Static Web App)

---

## 💰 COSTOS

**Azure Static Web Apps**:
- **Free Tier**: 
  - 100 GB bandwidth/mes
  - 0.5 GB storage
  - ✅ **GRATIS para este proyecto**
- **Standard Tier**: $9/mes (si necesitas más)

---

## 📝 CHECKLIST DE TU COMPAÑERO

```
✅ Corregir mezcla CRA/Vite en main.jsx
✅ Crear staticwebapp.config.json
✅ Crear GitHub workflow para CI/CD
✅ Actualizar package.json con script deploy
⏳ Crear Static Web App en Azure
⏳ Configurar URL de backend
⏳ Push y verificar deploy
```

---

## 🚀 SIGUIENTE PASO

**Para tu compañero:**

1. **Decidir método de deploy**:
   - Portal Azure (más visual)
   - Azure CLI (más rápido)
   - GitHub Actions (automático)

2. **Crear el Static Web App**

3. **Verificar que carga la UI**

4. **Deploy backend** (para que el chat funcione)

5. **Conectar frontend con backend URL**

---

**¿Listo para deploy?** 🚀

Dile a tu compañero que ya está todo corregido y listo para subir a Azure.
