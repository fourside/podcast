FROM ruby:2.6-alpine3.8

WORKDIR /work

COPY . .

RUN apk add --no-cache \
        bash curl perl tzdata libxml2-utils ffmpeg \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && bundle install --path=bin --without development test --deployment \
    && crontab ./crontab \
    && ln -s /dev/stdout /var/log/cron.log \
    && mkdir ../public

CMD ["crond", "-f", "-L", "/var/log/cron.log"]
