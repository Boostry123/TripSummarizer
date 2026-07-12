# --- Stage 1: Base ---
FROM node:26-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage 2: Development ---
FROM base AS development
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev:docker"]

# --- Stage 3: Production ---
FROM base AS production
COPY . .
# If you compile TypeScript on the backend, add a build step here and only copy the output
EXPOSE 3001
CMD ["node", "index.js"]