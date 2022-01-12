FROM denoland/deno:alpine-1.17.2

WORKDIR /work

COPY ./radiko ./
COPY ./batch/* ./

RUN apk add --no-cache \
        bash curl tzdata libxml2-utils ffmpeg jq coreutils make \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && chmod +x ./radi.sh \
    && crontab ./crontab \
    && ln -s /dev/stdout /var/log/cron.log \
    && mkdir /public

CMD ["crond", "-f", "-L", "/var/log/cron.log"]
