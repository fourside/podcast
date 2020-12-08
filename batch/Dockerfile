FROM alpine:3.12.1

WORKDIR /work

COPY . .

RUN apk add --no-cache \
        bash curl tzdata libxml2-utils ffmpeg jq \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && chmod +x ./radi.sh \
    && crontab ./crontab \
    && ln -s /dev/stdout /var/log/cron.log \
    && mkdir /public

CMD ["crond", "-f", "-L", "/var/log/cron.log"]
