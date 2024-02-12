FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY . .

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base as prod
ENV NODE_ENV="production"
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=base /app/static /app/static

CMD ["pnpm", "run", "start"]
