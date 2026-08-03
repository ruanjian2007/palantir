#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required"
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required"
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

docker compose up -d onto-postgres

for _ in $(seq 1 30); do
  if docker exec onto-romaapi-postgres pg_isready -U onto -d onto_romaapi >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

export DATABASE_URL="${DATABASE_URL:-postgresql://onto:onto@127.0.0.1:5433/onto_romaapi?schema=public}"
export APP_URL="${APP_URL:-https://onto.romaapi.com}"
export OPS_CONSOLE_SECRET="${OPS_CONSOLE_SECRET:-roma-onto-secret}"
export OPS_CONSOLE_ACCESS_KEY="${OPS_CONSOLE_ACCESS_KEY:-replace-this-key}"

pnpm install --frozen-lockfile
pnpm db:push
pnpm db:seed
pnpm build

pm2 startOrReload ecosystem.config.js --only onto-romaapi
pm2 save

echo "onto-romaapi deployed on :3015"
