# Etapa base para instalar dependências
FROM node:20-alpine AS base

RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# Etapa de build do app
FROM base AS build

COPY . .

RUN pnpm build
RUN pnpm prune --prod

FROM base AS migrator

WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./

CMD ["pnpm", "db:migrate"]

FROM gcr.io/distroless/nodejs22-debian12 AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json

EXPOSE 3333

CMD ["dist/infra/http/server.js"]
