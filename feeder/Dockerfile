FROM node:20-alpine3.17 as builder

RUN apk add --no-cache libc6-compat tzdata \
    && cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /app

COPY . ./

RUN npm ci
RUN npm run build


FROM node:20-alpine3.17 as runner

WORKDIR /app

ENV NODE_ENV production

COPY package* ./
RUN npm ci --production && mkdir dist

COPY --from=builder /app/dist ./dist
COPY --from=builder /etc/localtime /etc/localtime

USER node

CMD ["npm", "start"]
