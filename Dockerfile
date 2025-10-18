# =========================
# Etapa 1: build do backend
# =========================
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend

# Copia e instala dependências (incluindo dev para build)
COPY backend/package*.json ./
RUN npm ci --include=dev

COPY backend ./

# Gera Prisma Client (irá para node_modules/@prisma/client)
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# =========================
# Etapa 2: build do frontend
# =========================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend ./

# Configura variável para backend interno
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Build do Next.js
RUN npm run build

# =========================
# Etapa 3: runtime final
# =========================
FROM node:22-alpine AS runner
WORKDIR /app

# Instala curl/wget para healthcheck
# RUN apk add --no-cache curl wget bash

# Copia backend
COPY --from=backend-builder /app/backend ./backend
# Copia frontend build
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

# Instala apenas deps de produção
RUN cd backend && npm ci --omit=dev && cd ../frontend && npm ci --omit=dev

# Expõe apenas o frontend
EXPOSE 3000

# Variáveis de ambiente padrão (podem ser sobrescritas no Coolify)
ENV NODE_ENV=production
ENV PORT=5000
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# =========================
# CMD final: executa migrations e inicia backend + frontend
# =========================
WORKDIR /app

CMD bash -c "\
  echo '🏗️  Executando migrations...' && \
  cd /app/backend && npx prisma migrate deploy && \
  echo '🚀 Iniciando backend...' && node dist/index.js & \
  echo '🎮 Iniciando frontend...' && cd /app/frontend && npm start \
"
