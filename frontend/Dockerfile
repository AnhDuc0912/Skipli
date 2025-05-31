FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install && \
    npm install rollup

# Copy source code + env file
COPY . .
# Build Vite app - đây là lúc VITE_API_URL trong .env.production được đọc
RUN npm run build

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
