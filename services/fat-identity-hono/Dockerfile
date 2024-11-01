FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
# Copy package files first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/fat-identity-hono/package.json ./services/fat-identity-hono/
# Install dependencies
RUN pnpm install --frozen-lockfile
# Then copy the rest of the files
COPY . .
# Build only this package
RUN pnpm run build --filter=@repo/fat-identity-hono...
RUN pnpm deploy --filter=@repo/fat-identity-hono --prod /prod/app

FROM base
COPY --from=build /prod/app /prod/app
WORKDIR /prod/app
EXPOSE 3000
CMD [ "node", "./dist/index.js" ]