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

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROMIUM_PATH=/usr/bin/chromium
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps
RUN npm install express@5 cors tsx --legacy-peer-deps

COPY . .

RUN mkdir -p out

# Pre-bundle Remotion so renders don't need to bundle each time
RUN npx remotion bundle

EXPOSE 3100

CMD ["npx", "tsx", "server.ts"]
