### Common between dev scraper and release scraper
FROM python:3-alpine AS scraper-base

# Copy in the python scripts
RUN mkdir -p /srv/scripts
ADD ./scripts /srv/scripts
WORKDIR /srv/scripts

# Create the space for the EquipmentAliases.ts file
RUN mkdir -p /srv/src/lib/

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt


### Util for regenerating /cdn on dev machines via docker
FROM scraper-base AS scraper-dev
CMD ["sh", "-c", "python generateEquipment.py && python generateMonsters.py && python generateEquipmentAliases.py"]

### Used below in release docker image
FROM scraper-base AS scraper-image

# Copy in the cdn dir to prevent unnecessary asset redownloads
ADD ./cdn /srv/cdn

# Regenerate the cdn dir
RUN python generateEquipment.py
RUN python generateEquipmentAliases.py
RUN python generateMonsters.py



### Build the web app into a static site
FROM node:21-slim AS node

ARG BASE_URL="http://localhost"
ARG BASE_PATH=""
ARG SHORTLINK_URL="$BASE_URL$BASE_PATH"

RUN apt-get update && apt-get install git -y

WORKDIR /srv
ADD . /srv

# Copy the results of the cdn scrape from last step
COPY --from=scraper-image /srv/cdn /srv/cdn

# install deps
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install

# override path envvars
RUN echo "NEXT_PUBLIC_BASE_URL=$BASE_URL" > .env.local
RUN if [ ! -z '$BASE_PATH' ]; then \
      echo NEXT_PUBLIC_BASE_PATH=$BASE_PATH >> .env.local; \
    fi
RUN echo "NEXT_PUBLIC_SHORTLINK_URL=$SHORTLINK_URL" >> .env.local

# build prod optimized bundle
# mount git dir for metadata
RUN --mount=type=bind,source=.git/,target=.git/ \
    yarn build



### Minimize down to a slim static hosting server
FROM nginx:alpine

COPY --from=node /srv/out /usr/share/nginx/html
