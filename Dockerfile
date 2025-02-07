# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including dev dependencies for now)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create startup script
RUN echo '#!/bin/sh\n\
echo "DATABASE_URL: $DATABASE_URL"\n\
npx prisma generate\n\
npm run start:prod' > /app/start.sh && \
chmod +x /app/start.sh

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL="projects/470771286195/secrets/DATABASE_URL:latest"
ENV GOOGLE_CLIENT_ID="projects/470771286195/secrets/GOOGLE_CLIENT_ID:latest"
ENV GOOGLE_CLIENT_SECRET="projects/470771286195/secrets/GOOGLE_CLIENT_SECRET:latest"
ENV GOOGLE_REFRESH_TOKEN="projects/470771286195/secrets/GOOGLE_REFRESH_TOKEN:latest"
ENV JWT_SECRET="projects/470771286195/secrets/JWT_SECRET:latest"
ENV JWT_EXPIRES_IN="projects/470771286195/secrets/JWT_EXPIRES_IN:latest"
ENV GCLOUD_STORAGE_BUCKET="projects/470771286195/secrets/GCLOUD_STORAGE_BUCKET:latest"
ENV GCLOUD_PROJECT_ID="projects/470771286195/secrets/GCLOUD_PROJECT_ID:latest"

# Expose port
EXPOSE 3000

# Start the application using the startup script
CMD ["/app/start.sh"]