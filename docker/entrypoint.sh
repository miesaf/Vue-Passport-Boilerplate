#!/usr/bin/env sh
set -e

# Defaults (match your .env example)
: "${VUE_APP_NAME:=Vue + Laravel Passport Boilerplate}"
: "${VUE_APP_BASE_URL:=./}"
: "${VUE_APP_URL:=http://localhost/}"
: "${VUE_APP_BE:=http://localhost/api/}"
: "${VUE_APP_SITO:=900}"
: "${VUE_APP_PUBLIC:=./}"

cat >/usr/share/nginx/html/env.js <<EOF
window.__ENV = {
  VUE_APP_NAME: $(printf '%s' "$VUE_APP_NAME" | jq -Rs .),
  VUE_APP_BASE_URL: $(printf '%s' "$VUE_APP_BASE_URL" | jq -Rs .),
  VUE_APP_URL: $(printf '%s' "$VUE_APP_URL" | jq -Rs .),
  VUE_APP_BE: $(printf '%s' "$VUE_APP_BE" | jq -Rs .),
  VUE_APP_SITO: $(printf '%s' "$VUE_APP_SITO" | jq -Rs .),
  VUE_APP_PUBLIC: $(printf '%s' "$VUE_APP_PUBLIC" | jq -Rs .)
};
EOF

exec "$@"
