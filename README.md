# podcast
- generate rss feed for podcast
- protect by basic auth for private use

## usage
- in development, `docker-compose up -d`
- in production, `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
- set env as below:
    - `export SQS_URL=https://sqs.xxxxxxxxxxxxxx.amazonaws.com/xxx/xxx.fifo`
    - `export AWS_ACCESS_KEY_ID=xxxxxxxxxx`
    - `export AWS_SECRET_ACCESS_KEY=xxxxxxx`

## docker version

```bash
# docker -v
Docker version 18.06.1-ce, build e68fc7a215d7133c34aa18e3b72b4a21fd0c6136
# docker-compose -v
docker-compose version 1.23.2, build 1110ad01
```
