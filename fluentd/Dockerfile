FROM fluent/fluentd:v1.14-1

USER root

RUN apk add --no-cache --virtual .builddeps \
        gcc make libc-dev linux-headers ruby-dev \
    && fluent-gem install fluent-plugin-mongo -v 1.2.1 -N \
    && apk del .builddeps

USER fluent

ENV FLUENTD_CONF fluent.conf

COPY ./fluent.conf /fluentd/etc/

