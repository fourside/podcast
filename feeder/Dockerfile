FROM ruby:2.6-alpine3.8 as builder

WORKDIR /work

COPY Gemfile* ./

RUN apk add --no-cache --virtual .ruby-builddeps \
        gcc make libc-dev linux-headers tzdata \
    && mkdir bin \
    && bundle install --path=bin --without development test --deployment \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && apk del .ruby-builddeps


FROM ruby:2.6-alpine3.8

ENV APP_ROOT /app

WORKDIR $APP_ROOT

COPY . .
COPY --from=builder /work/bin ./bin
COPY --from=builder /usr/local/bundle/config /usr/local/bundle/
COPY --from=builder /etc/localtime /etc/localtime

RUN ln -s /dev/stdout ${APP_ROOT}/logs/unicorn.log \
    && ln -s /dev/stderr ${APP_ROOT}/logs/unicorn_err.log

CMD ["bundle", "exec", "unicorn", "-c", "config/unicorn.conf.rb"]

