FROM ruby:2.6-alpine3.8

WORKDIR work

COPY . .

RUN apk add --no-cache --virtual .build-deps \
        gcc make libc-dev tzdata \
    && apk add --no-cache \
        bash wget perl libxml2-utils rtmpdump ffmpeg \
    && wget http://www.swftools.org/swftools-2013-04-09-1007.tar.gz \
    && tar xzf swftools-2013-04-09-1007.tar.gz \
    && cd swftools-2013-04-09-1007 \
    && ./configure && make && make install \
    && cd - \
    && rm -rf ./swftools* \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && crontab ./crontab \
    && mkdir ../public \
    && apk del .build-deps

CMD ["crond", "-f", "-L", "/var/log/cron.log"]

