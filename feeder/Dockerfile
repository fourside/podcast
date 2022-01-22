FROM node:16-alpine3.14 as builder

RUN apk add --no-cache libc6-compat tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /app

COPY . ./

RUN npm ci
RUN npm run build


FROM node:16-alpine3.14 as runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY package* ./
RUN npm ci --production && mkdir dist

COPY --from=builder /app/dist ./dist
COPY --from=builder /etc/localtime /etc/localtime

CMD ["npm", "start"]
