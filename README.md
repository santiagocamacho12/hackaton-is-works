# IS Works - Plataforma de Trabajos de Ingeniería de Sistemas

Sistema completo de gestión de trabajos académicos y proyectos de Ingeniería de Sistemas con autenticación, CRUD completo, logging y panel de administración.

## Estructura del Proyecto

\`\`\`
is-works/
├── is-works-frontend/    # React + Vite + TypeScript + Bootstrap 5
├── is-works-backend/     # Node + Express + TypeScript
├── docker-compose.yml    # Configuración Docker
└── README.md            # Este archivo
\`\`\`

## Características Principales

### Frontend
- React 18 + Vite + TypeScript
- React Router 6 para navegación
- Bootstrap 5 para UI
- Validación con Zod
- Autenticación JWT con refresh tokens
- Rutas protegidas
- Sistema de toasts para notificaciones
- 6+ utilidades TypeScript (fetchJSON, retry, debounce, formatDate, validateForm, guardAuth)

### Backend
- Node.js + Express + TypeScript (ESM)
- Autenticación JWT (access + refresh tokens)
- Logging con Winston (JSON format)
- Validación con Zod
- Control de concurrencia optimista
- Base de datos en memoria con 10 trabajos demo
- Manejo de errores centralizado (400/401/403/404/409/500)

## Requisitos Previos

- Node.js 20+
- npm 9+
- Docker y Docker Compose (opcional)

## Instalación y Ejecución

### Opción 1: Con Docker Compose (Recomendado)

\`\`\`bash
# Clonar el repositorio
git clone <repo-url>
cd is-works

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
\`\`\`

Acceder a:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Opción 2: Instalación Manual

#### Backend

\`\`\`bash
cd is-works-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Desarrollo
npm run dev

# Producción
npm run build
npm start
\`\`\`

#### Frontend

\`\`\`bash
cd is-works-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Desarrollo
npm run dev

# Producción
npm run build
npm run preview
\`\`\`

## Usuario Demo

\`\`\`
Email: admin@example.com
Password: Admin#12345
Rol: admin
\`\`\`

## Rutas de la Aplicación

### Públicas
- \`/\` - Página principal con trabajos destacados
- \`/works\` - Lista de todos los trabajos
- \`/works/:id\` - Detalle de un trabajo
- \`/blog\` - Blog
- \`/contact\` - Formulario de contacto
- \`/login\` - Inicio de sesión

### Protegidas (requieren autenticación)
- \`/dashboard\` - Panel de usuario
- \`/works/create\` - Crear nuevo trabajo
- \`/works/:id/edit\` - Editar trabajo

### Admin (requieren rol admin)
- \`/logs\` - Logs del sistema

## API Endpoints

### Autenticación

\`\`\`bash
# Login
POST /api/auth/login
Body: { "email": "admin@example.com", "password": "Admin#12345" }

# Refresh token
POST /api/auth/refresh
Cookie: refreshToken
\`\`\`

### Trabajos

\`\`\`bash
# Listar trabajos
GET /api/works?search=&page=1&limit=10

# Obtener trabajo por ID
GET /api/works/:id

# Crear trabajo (requiere auth)
POST /api/works
Headers: Authorization: Bearer <token>
Body: {
  "title": "Mi Trabajo",
  "category": "Redes",
  "description": "Descripción del trabajo",
  "tags": ["networking", "python"],
  "link": "https://github.com/usuario/proyecto"
}

# Actualizar trabajo (requiere auth + version)
PUT /api/works/:id
Headers: 
  Authorization: Bearer <token>
  If-Match: <version>
Body: { "title": "Título actualizado", ... }

# Eliminar trabajo (requiere auth + version)
DELETE /api/works/:id
Headers:
  Authorization: Bearer <token>
  If-Match: <version>
\`\`\`

### Logs (solo admin)

\`\`\`bash
# Obtener logs
GET /api/logs?page=1&limit=20
Headers: Authorization: Bearer <token>
\`\`\`

## Ejemplos con curl

\`\`\`bash
# Login y guardar cookies
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin#12345"}' \
  -c cookies.txt

# Obtener trabajos
curl http://localhost:3000/api/works

# Crear trabajo
curl -X POST http://localhost:3000/api/works \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{
    "title": "Sistema de Monitoreo",
    "category": "Redes",
    "description": "Sistema para monitorear tráfico de red",
    "tags": ["networking", "python", "monitoring"],
    "link": "https://github.com/example/network-monitor"
  }'

# Actualizar trabajo (con control de versión)
curl -X PUT http://localhost:3000/api/works/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "If-Match: 1" \
  -d '{"title": "Sistema de Monitoreo Actualizado"}'

# Eliminar trabajo
curl -X DELETE http://localhost:3000/api/works/1 \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "If-Match: 2"

# Obtener logs (admin)
curl http://localhost:3000/api/logs \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
\`\`\`

## Control de Concurrencia

El sistema implementa control optimista de concurrencia:

1. Cada trabajo tiene un campo \`version\` que se incrementa en cada actualización
2. Las operaciones PUT y DELETE requieren el header \`If-Match\` con la versión esperada
3. Si la versión no coincide, el servidor retorna 409 Conflict
4. El cliente debe recargar el recurso y reintentar la operación

Ejemplo:
\`\`\`typescript
// Obtener trabajo
const work = await worksAPI.getById('1') // version: 1

// Actualizar trabajo
await worksAPI.update('1', { title: 'Nuevo título' }, work.version)

// Si otro usuario actualizó el trabajo mientras tanto:
// Error 409: "Version conflict: expected 1, got 2"
\`\`\`

## Logging

El sistema registra automáticamente:
- Login de usuarios
- Creación, actualización y eliminación de trabajos
- Errores del servidor (5xx)
- Información contextual: timestamp, nivel, userId, IP, User-Agent

Los logs se almacenan en:
- \`logs/combined.log\` - Todos los logs
- \`logs/error.log\` - Solo errores

Formato JSON:
\`\`\`json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User logged in: admin@example.com",
  "userId": "1",
  "ip": "::1",
  "userAgent": "Mozilla/5.0..."
}
\`\`\`

## Validación de Formularios

Todos los formularios usan Zod para validación con mensajes específicos por campo:

\`\`\`typescript
// Ejemplo: Validación de trabajo
const workSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  category: z.string().min(1, 'La categoría es requerida'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  tags: z.array(z.string()).min(1, 'Debe incluir al menos un tag'),
  link: z.string().url('Debe ser una URL válida'),
})
\`\`\`

## Utilidades TypeScript

El proyecto incluye 6+ funciones utilitarias en \`src/lib/http.ts\`:

1. **fetchJSON<T>** - Wrapper genérico para fetch con manejo de errores y timeout
2. **retry<T>** - Reintentos automáticos para peticiones GET fallidas
3. **debounce** - Debounce para inputs de búsqueda
4. **formatDate** - Formateo de fechas en español
5. **validateForm<T>** - Validación con Zod y manejo de errores
6. **guardAuth** - Verificación de autenticación

## Tecnologías Utilizadas

### Frontend
- React 18.3
- Vite 5.1
- TypeScript 5.3
- React Router 6.22
- Bootstrap 5.3
- Zod 3.22

### Backend
- Node.js 20
- Express 4.18
- TypeScript 5.3
- Winston 3.11 (logging)
- Zod 3.22 (validación)
- JWT (jsonwebtoken 9.0)
- bcrypt 5.1
- Better-SQLite3 9.4

## Estructura de Carpetas

### Frontend
\`\`\`
src/
├── main.tsx
├── App.tsx
├── routes/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   ├── Logs.tsx
│   └── works/
│       ├── List.tsx
│       ├── Detail.tsx
│       ├── Create.tsx
│       └── Edit.tsx
├── components/
│   ├── Header.tsx
│   ├── NavBar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── WorkCard.tsx
│   ├── ProtectedRoute.tsx
│   └── ToastContainer.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useToast.ts
├── lib/
│   ├── api.ts
│   ├── http.ts
│   └── validators.ts
└── styles/
    └── theme.css
\`\`\`

### Backend
\`\`\`
src/
├── index.ts
├── server.ts
├── config/
│   ├── env.ts
│   └── logger.ts
├── middlewares/
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/
│   ├── auth.routes.ts
│   ├── works.routes.ts
│   └── logs.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── works.controller.ts
│   └── logs.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── works.service.ts
│   └── logs.service.ts
├── models/
│   ├── user.model.ts
│   ├── work.model.ts
│   └── log.model.ts
└── db/
    └── memory.ts
\`\`\`

## Datos de Ejemplo

El sistema incluye 10 trabajos de ejemplo en diferentes categorías:
- Redes
- Desarrollo Web
- Bases de Datos
- Inteligencia Artificial
- DevOps

## Comandos Útiles

### Frontend
\`\`\`bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
npm run type-check   # Verificación de tipos
\`\`\`

### Backend
\`\`\`bash
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start            # Servidor de producción
npm run lint         # Linter
\`\`\`

## Licencia

MIT

## Autor

Proyecto desarrollado para la materia de Ingeniería de Sistemas
\`\`\`
