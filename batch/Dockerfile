FROM alpine:3.11.2 as builder

WORKDIR work

RUN apk add --no-cache --virtual .build-deps \
        gcc make libc-dev zlib-dev tzdata \
    && wget http://www.swftools.org/swftools-2013-04-09-1007.tar.gz \
    && tar xzf swftools-2013-04-09-1007.tar.gz \
    && cd swftools-2013-04-09-1007 \
    && ./configure && make && make install \
    && cd - \
    && rm -rf ./swftools* \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && apk del .build-deps


FROM alpine:3.11.2

WORKDIR work

COPY . .
COPY --from=builder /etc/localtime /etc/
COPY --from=builder /usr/local/bin/swfextract /usr/local/bin/

RUN apk add --no-cache \
        bash wget perl libxml2-utils rtmpdump ffmpeg ruby curl \
    && crontab ./crontab \
    && ln -s /dev/stdout /var/log/cron.log \
    && mkdir ../public

CMD ["crond", "-f", "-L", "/var/log/cron.log"]

