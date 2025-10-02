# IS Works Frontend

Frontend para la plataforma de Trabajos de Ingeniería de Sistemas.

## Tecnologías

- React 18
- Vite
- TypeScript
- React Router 6
- Bootstrap 5
- Zod (validación)

## Estructura del Proyecto

\`\`\`
src/
├── main.tsx              # Punto de entrada
├── App.tsx               # Componente principal con rutas
├── routes/               # Páginas/Rutas
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Blog.tsx
│   └── Contact.tsx
├── components/           # Componentes reutilizables
│   ├── Header.tsx
│   ├── NavBar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── WorkCard.tsx
│   ├── ProtectedRoute.tsx
│   └── ToastContainer.tsx
├── hooks/                # Custom hooks
│   ├── useAuth.ts
│   └── useToast.ts
├── lib/                  # Utilidades y API
│   ├── api.ts           # Cliente API
│   ├── http.ts          # Utilidades HTTP (fetchJSON, retry, debounce, etc.)
│   └── validators.ts    # Esquemas Zod
└── styles/
    └── theme.css        # Estilos personalizados
\`\`\`

## Instalación

\`\`\`bash
npm install
\`\`\`

## Configuración

Crea un archivo `.env` basado en `.env.example`:

\`\`\`
VITE_API_URL=http://localhost:3000
\`\`\`

## Comandos

\`\`\`bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint

# Type check
npm run type-check
\`\`\`

## Rutas

- `/` - Página principal con trabajos destacados
- `/login` - Inicio de sesión
- `/dashboard` - Dashboard (protegida)
- `/works` - Lista de trabajos
- `/works/:id` - Detalle de trabajo
- `/works/create` - Crear trabajo (protegida)
- `/works/:id/edit` - Editar trabajo (protegida)
- `/blog` - Blog
- `/contact` - Contacto
- `/logs` - Logs del sistema (solo admin)

## Utilidades TypeScript

El proyecto incluye 6+ funciones utilitarias en `src/lib/http.ts`:

1. `fetchJSON<T>` - Wrapper genérico para fetch con manejo de errores
2. `retry<T>` - Reintentos automáticos para peticiones GET
3. `debounce` - Debounce para inputs
4. `formatDate` - Formateo de fechas
5. `validateForm<T>` - Validación con Zod
6. `guardAuth` - Guard de autenticación

## Autenticación

El sistema usa JWT con:
- Access token en localStorage
- Refresh token en cookie httpOnly
- ProtectedRoute para rutas privadas
- Hook useAuth para gestión de sesión

## Usuario Demo

\`\`\`
Email: admin@example.com
Password: Admin#12345
