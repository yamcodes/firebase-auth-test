FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
# Copy package files first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /usr/src/app/
COPY services/fat-identity-hono/package.json /usr/src/app/services/fat-identity-hono/
WORKDIR /usr/src/app
RUN pnpm install --frozen-lockfile
# Then copy the rest of the source code
COPY . /usr/src/app
# Putting the "--filter" before the command uses pnpm filtering, whilst putting it after the command uses turborepo filtering
# Read about pnpm filtering here: https://pnpm.io/filtering
# Read about turborepo filtering here: https://turbo.build/repo/docs/core-concepts/monorepos/filtering
RUN pnpm --filter=@repo/fat-identity-hono build:server
RUN pnpm deploy --filter=@repo/fat-identity-hono --prod /prod/app

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app
EXPOSE 3000
CMD [ "node", "./dist/index.js" ]