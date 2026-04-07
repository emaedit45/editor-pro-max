FROM node:20-bookworm

# Install Chrome dependencies for Remotion
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    fonts-liberation \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome path for Remotion
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROMIUM_PATH=/usr/bin/chromium
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./
COPY bun.lock* ./

# Install ALL dependencies (not just production)
ENV NODE_ENV=development
RUN npm install

# Copy project files
COPY . .

# Create output directory
RUN mkdir -p out

# Expose port
EXPOSE 3100

# Start server
CMD ["npx", "tsx", "server.ts"]
