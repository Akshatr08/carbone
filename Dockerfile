# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies using npm ci for deterministic builds
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the production bundle (generates .output directory)
RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Run as non-root user for better security and code quality
USER node

# Copy only the compiled output from the builder stage
COPY --from=builder /app/.output ./.output

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the standalone server
CMD ["node", ".output/server/index.mjs"]
