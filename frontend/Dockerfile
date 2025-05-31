# Build phase
FROM node:20 AS builder

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Clear npm cache, remove node_modules and package-lock.json, then install dependencies
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install && \
    npm install firebase@10.14.1

# Copy frontend code
COPY . .

# Build Vite app
RUN npm run build

# Serve phase
FROM nginx:alpine

# Copy static files from build phase
COPY --from=builder /app/build /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]