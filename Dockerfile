FROM denoland/deno:alpine-1.39.0

WORKDIR /work

COPY . .

RUN apk add --no-cache \
        tzdata ffmpeg bash unzip \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && unzip ./awscliv2.zip
    && ./aws/install
    && crontab ./crontab \
    && deno task cache

CMD ["crond", "-f", "-L", "/var/log/cron.log"]