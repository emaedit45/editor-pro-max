FROM node:20-bookworm

# Install Chromium + ffmpeg for Remotion
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    fonts-liberation \
    fonts-noto-color-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Chrome path for Remotion
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROMIUM_PATH=/usr/bin/chromium
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

WORKDIR /app

# Install ALL dependencies (including devDependencies for tsx/typescript)
COPY package.json package-lock.json ./
RUN npm install --force --include=dev

# Copy source
COPY . .

# Verify critical modules exist
RUN node -e "require('express'); require('cors'); console.log('OK: express + cors')"
RUN npx tsx --version

# Create output directory
RUN mkdir -p out

EXPOSE 3100

CMD ["npx", "tsx", "server.ts"]
