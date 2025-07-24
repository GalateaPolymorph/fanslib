FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN bun install

# Copy source code
COPY tsconfig.json ./
COPY src/ ./src/

# Install dependencies again to ensure everything is properly linked
RUN bun install

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "src/main.ts"]