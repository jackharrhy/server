FROM jarredsumner/bun:edge
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install
COPY src src
COPY tsconfig.json .
EXPOSE 3000
ENTRYPOINT ["bun", "src/server.ts"]