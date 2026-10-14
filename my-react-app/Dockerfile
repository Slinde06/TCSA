FROM node:22-slim AS site
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev
COPY backend/src backend/src
COPY --from=site /app/frontend/dist frontend/dist
EXPOSE 8080
CMD ["node", "backend/src/server.js"]
