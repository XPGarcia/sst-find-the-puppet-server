# Common build stage
FROM node:18.12.1-alpine3.16 as common-build-stage

RUN apk add --no-cache python3 make g++

COPY . ./app

WORKDIR /app

RUN npm install

RUN rm -f .npmrc

EXPOSE 3000

# Development build stage
FROM common-build-stage as development-build-stage

RUN chown -R node:node /tmp

ENV NODE_ENV development

CMD ["npm", "run", "start:dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]