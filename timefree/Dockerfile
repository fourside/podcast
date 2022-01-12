FROM denoland/deno:alpine-1.17.2

WORKDIR /work

COPY ./radiko .
COPY ./timefree .

RUN apk add --no-cache \
        bash curl perl tzdata libxml2-utils ffmpeg coreutils make \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && crontab ./crontab \
    && ln -s /dev/stdout /var/log/cron.log

CMD ["crond", "-f", "-L", "/var/log/cron.log"]
