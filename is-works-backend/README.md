# IS Works Backend

Backend API para la plataforma de Trabajos de Ingeniería de Sistemas.

## Tecnologías

- Node.js
- Express
- TypeScript (ESM)
- Winston (logging)
- Zod (validación)
- JWT (autenticación)
- bcrypt (hashing)
- Better-SQLite3 (base de datos en memoria)

## Estructura del Proyecto

\`\`\`
src/
├── index.ts              # Punto de entrada
├── server.ts             # Configuración de Express
├── config/
│   ├── env.ts           # Variables de entorno
│   └── logger.ts        # Configuración de Winston
├── middlewares/
│   ├── auth.ts          # Autenticación JWT
│   └── errorHandler.ts  # Manejo de errores
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
    └── memory.ts        # Base de datos en memoria
\`\`\`

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

Crea un archivo `.env` basado en `.env.example`:

\`\`\`
PORT=3000
AUTH_MODE=jwt
JWT_ACCESS_SECRET=change_me_access_secret_key
JWT_REFRESH_SECRET=change_me_refresh_secret_key
STATIC_USER_EMAIL=admin@example.com
STATIC_USER_PASSWORD=admin123
CORS_ORIGIN=http://localhost:5173
\`\`\`

### Modos de Autenticación

- **static**: Usuario y contraseña desde variables de entorno
- **jwt**: Autenticación completa con bcrypt y JWT

## Comandos

\`\`\`bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Lint
npm run lint
\`\`\`

## API Endpoints

### Auth

\`\`\`bash
# Login
POST /api/auth/login
Body: { "email": "admin@example.com", "password": "Admin#12345" }
Response: { "accessToken": "...", "user": { "id": "1", "email": "...", "role": "admin" } }

# Refresh token
POST /api/auth/refresh
Cookie: refreshToken (httpOnly)
Response: { "accessToken": "..." }
\`\`\`

### Works

\`\`\`bash
# Get all works
GET /api/works?search=&page=1&limit=10

# Get work by ID
GET /api/works/:id

# Create work (requires auth)
POST /api/works
Headers: Authorization: Bearer <token>
Body: { "title": "...", "category": "...", "description": "...", "tags": [...], "link": "..." }

# Update work (requires auth + version)
PUT /api/works/:id
Headers: 
  Authorization: Bearer <token>
  If-Match: <version>
Body: { "title": "...", ... }

# Delete work (requires auth + version)
DELETE /api/works/:id
Headers:
  Authorization: Bearer <token>
  If-Match: <version>
\`\`\`

### Logs (Admin only)

\`\`\`bash
# Get logs
GET /api/logs?page=1&limit=20
Headers: Authorization: Bearer <token>
\`\`\`

## Concurrencia

El sistema usa control optimista de concurrencia:
- Cada trabajo tiene un campo `version`
- PUT/DELETE requieren header `If-Match` con la versión esperada
- Si la versión no coincide, retorna 409 Conflict

## Logging

Winston registra:
- Login de usuarios
- CRUD de trabajos
- Errores 5xx
- Información: timestamp, nivel, ruta, userId, IP, User-Agent

Los logs se guardan en:
- `logs/combined.log` - Todos los logs
- `logs/error.log` - Solo errores

## Usuario Demo

\`\`\`
Email: admin@example.com
Password: Admin#12345
Role: admin
\`\`\`

## Ejemplos con curl

\`\`\`bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin#12345"}' \
  -c cookies.txt

# Get works
curl http://localhost:3000/api/works

# Create work
curl -X POST http://localhost:3000/api/works \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Mi Trabajo","category":"Redes","description":"Descripción del trabajo","tags":["networking","python"],"link":"https://github.com/example/work"}'

# Update work
curl -X PUT http://localhost:3000/api/works/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -H "If-Match: 1" \
  -d '{"title":"Trabajo Actualizado"}'

# Delete work
curl -X DELETE http://localhost:3000/api/works/1 \
  -H "Authorization: Bearer <token>" \
  -H "If-Match: 2"

# Get logs (admin only)
curl http://localhost:3000/api/logs \
  -H "Authorization: Bearer <token>"
\`\`\`
