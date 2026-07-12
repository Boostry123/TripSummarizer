# --- Stage 1: Base (Common dependencies) ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage 2: Development (Hot Reloading via Vite) ---
FROM base AS development
COPY . .
# Expose Vite's default port
EXPOSE 5173 
CMD ["npm", "run", "dev"]

# --- Stage 3: Builder (Compiles TypeScript & React for Prod) ---
FROM base AS builder
COPY . .
RUN npm run build

# --- Stage 4: Production (Serves static files via Nginx) ---
FROM nginx:alpine AS production
# Only copy the compiled 'dist' folder from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]