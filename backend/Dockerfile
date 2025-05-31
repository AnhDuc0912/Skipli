# Sử dụng Node.js image chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code backend
COPY . .

# Expose port (giả sử backend chạy trên port 8000)
EXPOSE 8000

# Lệnh chạy server
CMD ["npm", "start"]