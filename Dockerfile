FROM denoland/deno:alpine-1.39.0

WORKDIR /work

COPY . .

RUN apk add --no-cache \
        tzdata ffmpeg bash \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && crontab ./crontab \
    && deno task cache

CMD ["crond", "-f", "-L", "/var/log/cron.log"]