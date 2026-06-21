# Multi-stage Dockerfile for production-ready Angular SSG application

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production with SSG
RUN npm run build:ssg

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

# Install serve to run the static site
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/dist/world-cup-schedule ./dist

EXPOSE 3000

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "3000"]
