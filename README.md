# 🌾 AgroGlobal - Sistema Agrícola Digital Completo

## 📋 Descripción del Proyecto

AgroGlobal es una plataforma digital integral que conecta agricultores, clientes y administradores en un ecosistema innovador para el comercio agrícola. El sistema facilita la compra y venta de productos agrícolas frescos, la gestión de cultivos, y la administración completa del marketplace.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 13** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Framer Motion** (Animaciones)
- **Lucide React** (Iconos)

### Backend (Preparado para)
- **NestJS** (REST API)
- **TypeScript**
- **DTOs + class-validator**

### Base de Datos (Preparado para)
- **MariaDB**
- **TypeORM**
- **JWT** (Access + Refresh tokens)

## 🚀 Características Principales

### 🏠 Landing Page Elegante
- Hero section con carrusel de imágenes
- Sección de servicios con efectos hover avanzados
- Carrusel informativo (historia, misión, visión)
- Sección de artículos con modales interactivos
- Footer completo con información de contacto

### 🌍 Sistema de Internacionalización
- 4 idiomas: Español, English, Français, Português
- Selector elegante con banderas
- Traducciones completas de la interfaz

### 👥 Tres Roles de Usuario

#### 🛒 Cliente
- Marketplace con productos agrícolas
- Sistema de carrito de compras
- Filtros por categorías
- Búsqueda en tiempo real
- Cálculo automático de totales con IVA

#### 🌾 Agricultor
- **Marketplace**: Comprar productos de otros agricultores
- **Ofertas**: Gestionar productos propios
- **Tienda**: Directorio de agro veterinarias
- **Órdenes**: Sistema de pedidos con notificaciones
- **Bitácora**: Registro de actividades agrícolas
- **Cultivos**: Gestión de tipos de cultivos
- **Propiedades**: Administración de fincas

#### 👑 Administrador
- **Dashboard**: Estadísticas del sistema
- **Usuarios**: Gestión completa de cuentas
- **Productos**: Aprobación/rechazo de productos
- **Agro Veterinarias**: Gestión del directorio
- Control total del sistema

## 📱 Estructura de Navegación

```
/ (Landing Page)
├── /dashboard-select (Selección de roles)
├── /auth/client
│   ├── / (Bienvenida)
│   └── /login (Autenticación)
├── /auth/farmer
│   ├── / (Bienvenida)
│   └── /login (Autenticación)
├── /auth/admin
│   ├── / (Bienvenida)
│   └── /login (Autenticación)
├── /dashboard/client (Marketplace)
├── /dashboard/farmer (Dashboard completo)
└── /dashboard/admin (Panel de administración)
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Verde Natural**: #22C55E, #16A34A (Agricultura)
- **Azul Profesional**: #3B82F6, #0EA5E9 (Cliente)
- **Púrpura Elegante**: #8B5CF6, #6366F1 (Administrador)
- **Grises Sofisticados**: #64748B, #475569

### Efectos Visuales
- Animaciones fluidas con Framer Motion
- Efectos hover con escalado y rotación
- Transiciones suaves entre páginas
- Cards flotantes con backdrop blur
- Gradientes sofisticados
- Sombras dinámicas

## 🔧 Instalación y Configuración

```bash
# Frontend (Next.js)
npm install
npm run dev

# Backend (NestJS)
cd backend
npm install
npm run start:dev

# Base de Datos
# 1. Instalar MariaDB/MySQL
# 2. Crear base de datos: CREATE DATABASE agroglobal;
# 3. Importar esquema: mysql -u root -p agroglobal < database/agroglobal.sql
# 4. Configurar variables de entorno en .env
```

## 🔧 Configuración de Base de Datos

### Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=agroglobal
JWT_SECRET=agroglobal-super-secret-key-2025
PORT=3001
```

### Credenciales por Defecto
- **Admin:** admin@agroglobal.com / password

## 📊 Funcionalidades por Rol

### Cliente
- ✅ Navegación por categorías de productos
- ✅ Búsqueda y filtros avanzados
- ✅ Carrito de compras funcional
- ✅ Cálculo automático de totales
- ✅ Interfaz responsive y elegante

### Agricultor
- ✅ Marketplace para compras
- ✅ Gestión de productos propios
- ✅ Sistema de órdenes con notificaciones
- ✅ Bitácora de actividades agrícolas
- ✅ Gestión de cultivos y propiedades
- ✅ Directorio de agro veterinarias

### Administrador
- ✅ Dashboard con estadísticas
- ✅ Gestión completa de usuarios
- ✅ Aprobación de productos
- ✅ Control de agro veterinarias
- ✅ Activación/desactivación de cuentas
- ✅ Cambio de contraseñas de usuarios

## 🔗 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/statistics` - Estadísticas (Admin)
- `PATCH /api/users/:id/activate` - Activar usuario (Admin)
- `PATCH /api/users/:id/change-password` - Cambiar contraseña (Admin)

### Productos
- `GET /api/products/approved` - Productos aprobados (Marketplace)
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id/approve` - Aprobar producto (Admin)
- `PATCH /api/products/:id/reject` - Rechazar producto (Admin)

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders` - Listar órdenes
- `PATCH /api/orders/:id/status` - Actualizar estado

### Agro Veterinarias
- `GET /api/vet-shops/active` - Agro veterinarias activas
- `POST /api/vet-shops` - Crear agro veterinaria (Admin)
- `PATCH /api/vet-shops/:id/toggle-active` - Activar/Desactivar (Admin)

### Bitácora
- `POST /api/bitacora` - Crear entrada
- `GET /api/bitacora` - Listar entradas
- `PATCH /api/bitacora/:id` - Actualizar entrada

### Cultivos
- `POST /api/cultivos` - Crear cultivo
- `GET /api/cultivos` - Listar cultivos
- `PATCH /api/cultivos/:id/toggle-active` - Activar/Desactivar

### Propiedades
- `POST /api/propiedades` - Crear propiedad
- `GET /api/propiedades` - Listar propiedades
- `PATCH /api/propiedades/:id/toggle-active` - Activar/Desactivar

## 🔐 Sistema de Autenticación

### Flujo de Registro
1. Usuario selecciona su rol
2. Completa formulario de registro
3. Cuenta creada pero inactiva
4. Administrador activa la cuenta
5. Usuario puede iniciar sesión

### Campos de Registro
- Nombre completo
- Email
- Número de teléfono
- Lugar de residencia
- Contraseña
- Confirmar contraseña

### Seguridad Implementada
- **JWT Tokens** con expiración de 24 horas
- **Encriptación bcrypt** para contraseñas
- **Guards de autenticación** para rutas protegidas
- **Validación de roles** (Cliente, Agricultor, Admin)
- **Validación de DTOs** con class-validator

## 🛒 Sistema de Comercio

### Productos
- Imágenes de alta calidad
- Información detallada (precio, stock, ubicación)
- Sistema de ratings
- Categorización automática
- Control de inventario

### Carrito de Compras
- Gestión de cantidades
- Cálculo automático de totales
- IVA incluido (13%)
- Persistencia durante la sesión
- Interfaz intuitiva

## 🗄️ Base de Datos

### Tablas Principales
- **users** - Gestión de usuarios y roles
- **products** - Catálogo de productos agrícolas
- **orders** - Sistema de órdenes y pedidos
- **vet_shops** - Directorio de agro veterinarias
- **bitacora_entries** - Registro de actividades agrícolas
- **cultivos** - Gestión de tipos de cultivos
- **propiedades** - Administración de fincas

### Relaciones
- Usuario → Productos (1:N)
- Usuario → Órdenes (1:N)
- Usuario → Bitácora (1:N)
- Usuario → Cultivos (1:N)
- Usuario → Propiedades (1:N)
- Producto → Órdenes (1:N)

## 📈 Próximos Pasos

### Funcionalidades Adicionales
- [ ] Sistema de notificaciones push en tiempo real
- [ ] Chat entre agricultores y clientes
- [ ] Reportes y analytics avanzados
- [ ] Sistema de calificaciones y reviews
- [ ] Integración con métodos de pago (Stripe, PayPal)
- [ ] Geolocalización de fincas y productos
- [ ] Sistema de inventario avanzado
- [ ] Módulo de contabilidad para agricultores

### Optimizaciones Técnicas
- [ ] Implementar Redis para caché
- [ ] Optimización de consultas con índices
- [ ] Sistema de logs avanzado
- [ ] Monitoreo y métricas
- [ ] Tests unitarios y de integración
- [ ] CI/CD con Docker

## 🤝 Contribución

Este proyecto está diseñado como un sistema completo y profesional para el sector agrícola. Tanto el frontend como el backend están completamente implementados y listos para producción.

### Estructura del Proyecto
```
agroglobal/
├── app/                    # Frontend Next.js
├── backend/               # Backend NestJS
├── database/              # Scripts SQL
├── components/            # Componentes UI
└── README.md
```

## 📞 Contacto

Para más información sobre AgroGlobal:
- Email: info@agroglobal.com
- Teléfono: +506 2234-5678
- Ubicación: San José, Costa Rica

---
