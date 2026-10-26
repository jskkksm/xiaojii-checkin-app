FROM node:22-alpine

WORKDIR /app
COPY package.json server.js index.html styles.css app.js manifest.webmanifest sw.js ./
COPY icons ./icons

ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/data

RUN mkdir -p /data
VOLUME ["/data"]
EXPOSE 8080

CMD ["node", "server.js"]
