# syntax=docker/dockerfile:1.6

FROM node:24-alpine AS builder
WORKDIR /app

COPY .yarnrc.yml package.json yarn.lock ./
COPY .yarn/releases/ ./.yarn/releases/
RUN corepack enable && yarn install --immutable

COPY . .
RUN yarn build

FROM nginx:1.28-alpine AS runtime

RUN addgroup -g 1000 -S app && \
    adduser -u 1000 -S -G app -h /app -s /sbin/nologin app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

RUN chown -R app:app /var/cache/nginx /usr/share/nginx/html

USER app
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
