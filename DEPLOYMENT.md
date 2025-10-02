# Guía de Despliegue

## Despliegue en Vercel (Frontend) + Railway/Render (Backend)

### Frontend en Vercel

1. Conectar repositorio de GitHub
2. Configurar proyecto:
   - Framework Preset: Vite
   - Root Directory: \`is-works-frontend\`
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
3. Agregar variable de entorno:
   - \`VITE_API_URL\`: URL del backend en producción

### Backend en Railway

1. Conectar repositorio de GitHub
2. Configurar proyecto:
   - Root Directory: \`is-works-backend\`
   - Build Command: \`npm run build\`
   - Start Command: \`npm start\`
3. Agregar variables de entorno:
   - \`PORT\`: 3000
   - \`AUTH_MODE\`: jwt
   - \`JWT_ACCESS_SECRET\`: (generar secreto seguro)
   - \`JWT_REFRESH_SECRET\`: (generar secreto seguro)
   - \`CORS_ORIGIN\`: URL del frontend en Vercel

### Generar Secretos Seguros

\`\`\`bash
# En Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# O en terminal
openssl rand -hex 32
\`\`\`

## Despliegue con Docker en VPS

\`\`\`bash
# Clonar repositorio
git clone <repo-url>
cd is-works

# Configurar variables de entorno
cp is-works-backend/.env.example is-works-backend/.env
cp is-works-frontend/.env.example is-works-frontend/.env

# Editar archivos .env con valores de producción

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Actualizar
git pull
docker-compose down
docker-compose up -d --build
\`\`\`

## Configuración de Nginx (Reverse Proxy)

\`\`\`nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
\`\`\`

## SSL con Let's Encrypt

\`\`\`bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
\`\`\`

## Monitoreo y Logs

\`\`\`bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs del frontend
docker-compose logs -f frontend

# Acceder a logs de Winston
docker-compose exec backend cat /app/logs/combined.log
\`\`\`

## Backup de Datos

\`\`\`bash
# Backup de logs
docker-compose exec backend tar -czf /tmp/logs-backup.tar.gz /app/logs
docker cp is-works-backend-1:/tmp/logs-backup.tar.gz ./backups/

# Restaurar logs
docker cp ./backups/logs-backup.tar.gz is-works-backend-1:/tmp/
docker-compose exec backend tar -xzf /tmp/logs-backup.tar.gz -C /
\`\`\`
