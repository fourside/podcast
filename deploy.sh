#!/bin/bash
set -e
if [[ ! "${SQS_URL+set}" ]]; then
  echo "set env SQS_URL"
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

docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps
