# podcast

- generate rss feed for podcast
- protect by basic auth for private use

## usage

- run `docker-compose up -d`
- set env as below:
  - `export SQS_URL=https://sqs.xxxxxxxxxxxxxx.amazonaws.com/xxx/xxx.fifo`
  - `export DEAD_LETTER_SQS_URL=https://sqs.xxxxxxxxxxxxxx.amazonaws.com/xxx/xxx.fifo`
  - `export AWS_ACCESS_KEY_ID=xxxxxxxxxx`
  - `export AWS_SECRET_ACCESS_KEY=xxxxxxx`
  - `export SLACK_WEBHOOK_URL=xxxxxxx`
  - `export FEEDER_USER=xxxxxxx`
  - `export FEEDER_PASSWORD=xxxxxxx`

## docker version

```bash
# docker -v
Docker version 20.10.7, build f0df350
# docker-compose -v
docker-compose version 1.24.0, build 0aa59064
```
