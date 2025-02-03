FROM node:20
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV PORT=8080
ENV GCP_PROJECT_ID=light-ratio-447800-d5

EXPOSE 8080

# Use production mode
CMD ["npm", "run", "start:prod"]