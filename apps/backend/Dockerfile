FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig*.json ./

COPY apps/backend ./apps/backend

RUN npm install

WORKDIR /app/apps/backend
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/apps/backend/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
