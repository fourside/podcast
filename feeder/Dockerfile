FROM ruby:2.6-alpine3.8

ENV APP_ROOT /app

WORKDIR $APP_ROOT

COPY . .

RUN apk add --no-cache --virtual .ruby-builddeps \
        gcc make libc-dev linux-headers \
    && mkdir bin \
    && bundle install --path=bin \
    && ln -s /dev/stdout ${APP_ROOT}/logs/unicorn.log \
    && ln -s /dev/stderr #{APP_ROOT}/logs/unicorn_err.log \
    && apk del .ruby-builddeps

CMD ["bundle", "exec", "unicorn", "-c", "config/unicorn.conf.rb"]
