# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5173

COPY package*.json ./
RUN npm ci --omit=dev

# Copy the fresh 'build' folder
COPY --from=builder /app/build ./build

COPY --from=builder /app/package.json ./package.json

EXPOSE 5173

# The 'adapter-node' entry point is always index.js in your 'out' folder
CMD ["node", "build/index.js"]