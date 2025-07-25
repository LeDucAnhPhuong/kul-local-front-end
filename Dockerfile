# Stage 1: Build Vite app
FROM node:20-alpine AS build
WORKDIR /app

# Copy env file trước nếu dùng Clerk
COPY .env.production .env

COPY . .
RUN npm install

# Tăng bộ nhớ nếu cần
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm run typecheck && npm run buildonly

# Stage 2: Serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
