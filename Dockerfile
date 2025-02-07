# Build stage
FROM node:20 AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas arquivos essenciais antes da instalação
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copia todo o código para dentro do container
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copia package files
COPY package.json package-lock.json ./

# Instala apenas as dependências de produção
RUN npm ci --omit=dev

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copia o código compilado da stage anterior
COPY --from=builder /app/dist ./dist

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080

# Expõe a porta da aplicação
EXPOSE 8080

# Inicia a aplicação
CMD ["node", "dist/main"]