FROM oven/bun:1.1

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Start the application in development mode
CMD ["bun", "run", "dev"]
