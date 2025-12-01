# 🚀 Guía de Despliegue en Cloudflare

## Paso 1: Desplegar el Worker (Backend)

### 1.1 Instalar Wrangler (CLI de Cloudflare)
```bash
npm install -g wrangler
```

### 1.2 Login en Cloudflare
```bash
wrangler login
```

### 1.3 Desplegar el Worker
```bash
wrangler deploy
```

### 1.4 Configurar la API Key (IMPORTANTE)
1. Ve a tu dashboard de Cloudflare: https://dash.cloudflare.com
2. Ve a **Workers & Pages** > Tu worker > **Settings** > **Variables**
3. Agrega una nueva variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `TU_API_KEY_DE_GROQ` (usa la que generaste en Groq)
   - Marca como **Encrypted** ✅
4. Guarda los cambios

### 1.5 Copiar la URL del Worker
Después del deploy, verás algo como:
```
Published milkbox-chatbot-worker
  https://milkbox-chatbot-worker.TU-USUARIO.workers.dev
```

**Copia esa URL completa!**

---

## Paso 2: Actualizar el Chatbot

### 2.1 Editar chatbot.js
Abre `assets/js/chatbot.js` y en la línea 3, reemplaza:
```javascript
const WORKER_URL = 'https://milkbox-chatbot-worker.TU-USUARIO.workers.dev';
```

Por tu URL real del Worker que copiaste en el paso 1.5

---

## Paso 3: Desplegar el Sitio en Cloudflare Pages

### Opción A: Desde GitHub (Recomendado)

1. Ve a https://dash.cloudflare.com
2. **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Conecta tu repositorio de GitHub
4. Configuración:
   - **Project name:** milkbox-studio
   - **Production branch:** master
   - **Build command:** (dejar vacío)
   - **Build output directory:** `/`
5. Click en **Save and Deploy**

### Opción B: Deploy Manual

```bash
# Instalar Wrangler si no lo tienes
npm install -g wrangler

# Desde la carpeta del proyecto
wrangler pages deploy . --project-name=milkbox-studio
```

---

## ✅ Verificación

1. Abre tu sitio en Cloudflare Pages
2. Prueba el chatbot
3. Abre DevTools (F12) > Network
4. Haz una pregunta al chatbot
5. Verás que llama a tu Worker, NO a Groq directamente
6. ✅ Tu API Key está segura!

---

## 🔒 Seguridad

- ✅ La API Key está en las variables de entorno del Worker (encriptada)
- ✅ Nadie puede ver tu API Key en el código
- ✅ Solo tu Worker puede llamar a Groq
- ✅ Puedes agregar rate limiting si quieres

---

## 💰 Costos

- **Worker:** GRATIS (100,000 requests/día)
- **Pages:** GRATIS (hosting ilimitado)
- **Total:** $0 USD/mes 🎉

---

## 🆘 Problemas Comunes

### Error CORS
Si ves errores de CORS, asegúrate de que la URL del Worker en `chatbot.js` sea correcta.

### Error 401
Verifica que configuraste la variable `GROQ_API_KEY` en el dashboard del Worker.

### Worker no responde
Espera 1-2 minutos después de configurar la API Key para que se propague.

---

## 📝 Notas

- Después de desplegar, puedes eliminar `worker.js` y `wrangler.toml` de tu repositorio de GitHub si quieres
- La API Key solo existe en Cloudflare, nunca en tu código
- Puedes cambiar la API Key en cualquier momento desde el dashboard de Cloudflare
