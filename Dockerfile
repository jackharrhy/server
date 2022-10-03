FROM jarredsumner/bun:edge
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install
COPY now.ts .
COPY tsconfig.json .
EXPOSE 3000
ENTRYPOINT ["bun", "now.ts"]