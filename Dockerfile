# =========================
# Etapa 1: build do backend
# =========================
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend ./
RUN npm run build


# =========================
# Etapa 2: build do frontend
# =========================
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

# Copia o build do backend apenas para pegar o endereço base da API
COPY frontend ./

# Aqui configuramos a variável base da API apontando para o backend interno
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
RUN npm run build


# =========================
# Etapa 3: runtime final
# =========================
FROM node:22-alpine AS runner
WORKDIR /app

# Copia backend compilado
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copia frontend compilado
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

# Instala dependências necessárias para produção
RUN cd backend && npm ci --omit=dev && cd ../frontend && npm ci --omit=dev

# Variáveis de ambiente (você também pode definir via Coolify)
ENV NODE_ENV=production
ENV PORT=5000
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Expõe apenas o frontend (Next.js)
EXPOSE 3000

# Script de inicialização — inicia backend e frontend juntos
CMD \
  (cd /app/backend && node dist/index.js &) && \
  (cd /app/frontend && npm start)
