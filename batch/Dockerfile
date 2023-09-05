FROM denoland/deno:alpine-1.36.4

WORKDIR /work

COPY ./radiko ./
COPY ./batch/* ./

RUN apk add --no-cache \
        tzdata ffmpeg bash \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && crontab ./crontab \
    && mkdir /public

CMD ["crond", "-f", "-L", "/var/log/cron.log"]
