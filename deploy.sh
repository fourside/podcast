#!/bin/bash
set -e

source .env.vars

if [[ ! "${SQS_URL+set}" ]]; then
  echo "set env SQS_URL"
  exit 1
fi

if [[ ! "${DEAD_LETTER_SQS_URL+set}" ]]; then
  echo "set env DEAD_LETTER_SQS_URL"
  exit 1
fi

if [[ ! "${AWS_ACCESS_KEY_ID+set}" ]]; then
  echo "set env AWS_ACCESS_KEY_ID"
  exit 1
fi

if [[ ! "${AWS_SECRET_ACCESS_KEY+set}" ]]; then
  echo "set env AWS_SECRET_ACCESS_KEY"
  exit 1
fi

if [[ ! "${CLOUDFLARE_BUCKET_NAME+set}" ]]; then
  echo "set env CLOUDFLARE_BUCKET_NAME"
  exit 1
fi

if [[ ! "${CLOUDFLARE_ACCOUNT_ID+set}" ]]; then
  echo "set env CLOUDFLARE_ACCOUNT_ID"
  exit 1
fi

if [[ ! "${CLOUDFLARE_ACCESS_KEY_ID+set}" ]]; then
  echo "set env CLOUDFLARE_ACCESS_KEY_ID"
  exit 1
fi

if [[ ! "${CLOUDFLARE_SECRET_ACCESS_KEY+set}" ]]; then
  echo "set env CLOUDFLARE_SECRET_ACCESS_KEY"
  exit 1
fi

if [[ ! "${SLACK_WEBHOOK_URL+set}" ]]; then
  echo "set env SLACK_WEBHOOK_URL"
  exit 1
fi

docker compose ps
docker compose build
docker compose down
docker compose up -d
docker compose ps
