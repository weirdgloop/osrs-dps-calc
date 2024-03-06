FROM node:21-slim AS builder

ARG BASE_URL=https://tools.runescape.wiki
ARG BASE_PATH=/osrs-dps

WORKDIR /srv
ADD . /srv

# install deps
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

# optionally override envvars
RUN echo "NEXT_PUBLIC_BASE_URL=$BASE_URL" > .env.production
RUN if [ ! -z '$BASE_PATH']; then \
      echo NEXT_PUBLIC_BASE_PATH=$BASE_PATH >> .env.production; \
    fi

# build prod optimized bundle
RUN yarn build



FROM nginx:alpine

COPY --from=builder /srv/out /usr/share/nginx/html
