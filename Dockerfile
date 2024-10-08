# Development

FROM node:22-alpine AS development

WORKDIR /usr/app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY tsconfig.json src ./

# Build

FROM node:22-alpine AS build

WORKDIR /usr/app

RUN npm i -g pnpm

COPY --chown=node:node package.json pnpm-lock.yaml ./

COPY --chown=node:node --from=development /usr/app/node_modules ./node_modules

COPY --chown=node:node tsconfig.json src ./

RUN pnpm build

ENV NODE_ENV=production

RUN pnpm i --frozen-lockfile -P && pnpm prune

USER node

# Production

FROM node:22-alpine AS production

WORKDIR /usr/app

COPY --chown=node:node --from=build /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/app/dist ./dist

CMD [ "node", "dist/index.js" ]