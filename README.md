# podcast

## usage

- run the command below:

```bash
cat > .env.vars <<EOF
export SQS_URL=https://sqs.xxxxxxxxxxxxxx.amazonaws.com/xxx/xxx.fifo
export DEAD_LETTER_SQS_URL=https://sqs.xxxxxxxxxxxxxx.amazonaws.com/xxx/xxx.fifo
export AWS_ACCESS_KEY_ID=xxxxxxxxxx
export AWS_SECRET_ACCESS_KEY=xxxxxxx
export CLOUDFLARE_BUCKET_NAME=xxxxxxx
export CLOUDFLARE_ACCOUNT_ID=xxxxxxx
export CLOUDFLARE_ACCESS_KEY_ID=xxxxxxx
export CLOUDFLARE_SECRET_ACCESS_KEY=xxxxxxx
export SLACK_WEBHOOK_URL=xxxxxxx
export IS_PRODUCTION=true
EOF
```

- run `source .env.vars && docker compose up -d` or `./deploy.sh`

## docker version

```bash
# docker -v
Docker version 24.0.7, build afdd53b
# docker compose version
Docker Compose version v2.21.0
```
