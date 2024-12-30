FROM node:20

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm prisma:regenerate:sqlite

CMD ["pnpm", "run", "start:dev"]