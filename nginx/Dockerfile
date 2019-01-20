FROM nginx:1.15.8-alpine

RUN apk add --no-cache --virtual .build-deps \
        tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && apk del .build-deps

COPY nginx.conf /etc/nginx/
