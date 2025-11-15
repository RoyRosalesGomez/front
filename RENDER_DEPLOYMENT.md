# Guía de Despliegue en Render

Este proyecto está configurado para desplegarse en Render desde la rama `Ariel`.

## Configuración Inicial

### Opción 1: Usando el archivo render.yaml (Recomendado)

1. **Conecta tu repositorio a Render**
   - Ve a [Render Dashboard](https://dashboard.render.com/)
   - Click en "New +" → "Blueprint"
   - Conecta tu repositorio de GitHub
   - Render detectará automáticamente el archivo `render.yaml`

2. **Configura las variables de entorno**
   - En el dashboard de Render, ve a tu servicio
   - Click en "Environment" en el menú lateral
   - Agrega las siguientes variables:
     - `NEXT_PUBLIC_API_URL`: URL de tu API backend

3. **Selecciona la rama**
   - El archivo `render.yaml` ya está configurado para desplegar desde la rama `Ariel`
   - Si quieres cambiar la rama, edita la línea `branch: Ariel` en `render.yaml`

### Opción 2: Configuración Manual

1. **Crea un nuevo Web Service**
   - Ve a [Render Dashboard](https://dashboard.render.com/)
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub

2. **Configura el servicio**
   - **Name**: agroglobal-frontend (o el nombre que prefieras)
   - **Region**: Oregon (u otra región de tu preferencia)
   - **Branch**: Ariel (o la rama que quieras desplegar)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Variables de Entorno**
   - Click en "Advanced" o ve a la sección "Environment"
   - Agrega:
     - `NODE_ENV` = `production`
     - `NEXT_PUBLIC_API_URL` = URL de tu API

4. **Configuración adicional**
   - **Auto-Deploy**: Activado (desplegará automáticamente cuando hagas push a la rama)
   - **Plan**: Free (o el plan que prefieras)

## Cambiar la Rama de Despliegue

### Si usaste render.yaml:
1. Edita el archivo `render.yaml`
2. Cambia la línea `branch: Ariel` a la rama deseada
3. Haz commit y push de los cambios

### Si configuraste manualmente:
1. Ve a tu servicio en Render Dashboard
2. Click en "Settings"
3. En la sección "Build & Deploy", cambia el campo "Branch"
4. Guarda los cambios

## Monitoreo y Logs

- **Logs en vivo**: Ve a tu servicio → "Logs" tab
- **Builds**: Ve a tu servicio → "Events" tab para ver el historial de despliegues
- **Shell**: Puedes acceder a una shell del contenedor desde el tab "Shell"

## URLs

- **URL de producción**: Render te asignará una URL automáticamente (ej: `https://agroglobal-frontend.onrender.com`)
- **Dominio personalizado**: Puedes configurar un dominio personalizado en Settings → Custom Domains

## Despliegue Manual

Si quieres forzar un nuevo despliegue sin hacer cambios en el código:

1. Ve a tu servicio en Render Dashboard
2. Click en "Manual Deploy" → "Deploy latest commit"

## Troubleshooting

### El build falla
- Revisa los logs en el tab "Logs"
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el `package.json` tenga todos los scripts necesarios

### La aplicación no arranca
- Verifica el comando de inicio: `npm start`
- Revisa que Next.js esté configurado correctamente
- Chequea los logs para errores específicos

### Variables de entorno no se cargan
- Asegúrate de que las variables en Render coincidan con las que usa tu aplicación
- Las variables que empiezan con `NEXT_PUBLIC_` deben estar disponibles en build time

## Diferencias con Vercel

- **Ramas**: En Render puedes elegir cualquier rama para desplegar, no solo main
- **Build time**: Puede ser un poco más lento que Vercel en el plan free
- **Free tier**: Render hiberna los servicios gratuitos después de 15 minutos de inactividad
- **Dominios**: Render usa `.onrender.com` por defecto

## Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Deploy Next.js en Render](https://render.com/docs/deploy-nextjs-app)
- [Blueprint Spec](https://render.com/docs/blueprint-spec)
