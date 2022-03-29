FROM denoland/deno:alpine-1.17.2

WORKDIR /work

COPY ./radiko ./
COPY ./batch/* ./

RUN apk add --no-cache \
        tzdata ffmpeg make bash \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && crontab ./crontab \
    && ln -s /dev/stdout /var/log/cron.log \
    && mkdir /public

CMD ["crond", "-f", "-L", "/var/log/cron.log"]
