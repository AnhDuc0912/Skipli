# Giai đoạn build
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code frontend
COPY . .

# Build React app
RUN npm run build

# Giai đoạn serve
FROM nginx:alpine

# Copy static files từ giai đoạn build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config (tùy chọn, nếu cần)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (Nginx chạy trên port 80)
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]