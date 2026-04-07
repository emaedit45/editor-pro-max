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

# Copy ALL files first (including package-lock.json)
COPY . .

# Force NODE_ENV before install to ensure all deps are installed
ENV NODE_ENV=development
RUN npm install --force

# Verify
RUN node -e "require('express'); console.log('express OK')"
RUN node -e "require('cors'); console.log('cors OK')"
RUN npx tsx --version

# Create output directory
RUN mkdir -p out

ENV NODE_ENV=production
EXPOSE 3100

CMD ["npx", "tsx", "server.ts"]
