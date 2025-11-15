# Guía de Despliegue en Vercel - AgroGlobal Frontend

## 📋 Pre-requisitos

- Cuenta en [Vercel](https://vercel.com)
- Backend desplegado (API REST en producción)
- Node.js 18+ instalado localmente

## 🚀 Pasos para Desplegar

### 1. Preparar el Backend

Asegúrate de que tu backend esté desplegado y obtengas la URL de producción:
```
https://tu-backend.com/api
```

### 2. Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega la siguiente variable:

```
NEXT_PUBLIC_API_URL = https://tu-backend.com/api
```

**IMPORTANTE:** Esta URL debe apuntar a tu backend en producción.

### 3. Desplegar desde GitHub

#### Opción A: Conectar repositorio (Recomendado)

1. Sube tu código a GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/agroglobal-front.git
git push -u origin main
```

2. En Vercel Dashboard:
   - Click "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js
   - Click "Deploy"

#### Opción B: Despliegue con Vercel CLI

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Inicia sesión:
```bash
vercel login
```

3. Despliega:
```bash
vercel
```

4. Para producción:
```bash
vercel --prod
```

### 4. Configuración Post-Despliegue

Una vez desplegado, configura:

1. **Domain Settings**: Asigna un dominio personalizado (opcional)
2. **CORS**: Asegúrate de que el backend permita requests desde tu dominio Vercel

## 🔧 Build Configuration

El proyecto ya está configurado con:

```javascript
// next.config.js
- eslint.ignoreDuringBuilds: true
- typescript.ignoreBuildErrors: true
- images.unoptimized: true
- CORS headers configurados
```

## 📝 Checklist Pre-Despliegue

- [x] Código limpio sin imports no utilizados
- [x] Variables de entorno configuradas
- [x] Backend URL actualizada
- [x] next.config.js optimizado para Vercel
- [x] .env.example creado
- [x] vercel.json configurado

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Error: "API_URL undefined"
Verifica que `NEXT_PUBLIC_API_URL` esté en Environment Variables en Vercel.

### Error de CORS
Agrega tu dominio Vercel en la configuración CORS del backend:
```typescript
// Backend: main.ts
app.enableCors({
  origin: ['https://tu-app.vercel.app', 'http://localhost:3000'],
  credentials: true,
});
```

## 🔄 Re-despliegues Automáticos

Con GitHub conectado:
- Cada `git push` a `main` → Despliegue automático
- Pull Requests → Preview deployments

## 📱 URLs Finales

Después del despliegue obtendrás:
- **Production**: `https://tu-app.vercel.app`
- **Preview**: `https://tu-app-git-branch.vercel.app`

## 🎯 Optimizaciones Recomendadas

1. **Configurar dominios personalizados**
2. **Habilitar Analytics en Vercel**
3. **Configurar GitHub Actions para CI/CD**
4. **Agregar monitoring de errores (Sentry)**

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica las variables de entorno
3. Confirma que el backend esté accesible

---

**Desarrollado para AgroGlobal** 🌾
