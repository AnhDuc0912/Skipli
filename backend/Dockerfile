# Sử dụng Node.js 20 (Alpine) chính thức
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json nếu có
COPY package*.json ./

# Cài dependencies
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install && 

# Copy toàn bộ code backend vào container
COPY . .

# Mở port (giả sử ứng dụng chạy trên 8000, chỉnh nếu khác)
EXPOSE 8000

# Lệnh khởi chạy server
CMD ["npm", "start"]
