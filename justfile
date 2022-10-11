set dotenv-load

host := "$SERVER_HOST"
token := "$SERVER_TOKEN"

default: run

run:
    bun run src/server.ts

now-get:
    curl "{{host}}/now"

now-post CONTENT:
    curl \
    -X POST \
    -H "Authorization: Bearer {{token}}" \
    -H 'Content-Type: text/plain' \
    -d "{{CONTENT}}" \
    "{{host}}/now"
