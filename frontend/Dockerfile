# Build phase
FROM node:20 AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Clear npm cache, remove node_modules and package-lock.json, then install dependencies
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install && \
    npm install rollup

# Copy frontend code
COPY . .

# Build Vite app
RUN npm run build

# Expose port
EXPOSE 5173

# Run Nginx
CMD ["npm", "run", "dev"]