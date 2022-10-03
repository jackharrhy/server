curl \
  -X POST \
  -H "Authorization: Bearer $NOW_TOKEN" \
  -H 'Content-Type: text/plain' \
  -d "$1" \
  localhost:3000