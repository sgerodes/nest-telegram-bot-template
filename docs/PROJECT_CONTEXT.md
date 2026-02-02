# Project Context (LLM Summary)

Concise, high-signal overview to help future contributors or LLMs understand the project quickly.

## What This Project Is
- NestJS-based Telegram bot template with quiz features, admin utilities, and TON blockchain integration.
- Includes a Telegram WebApp (Mini App) for Cloud Storage testing and WebApp-to-bot communication.

## Tech Stack
- Backend: NestJS, TypeScript
- Bot: Telegraf via `nestjs-telegraf`, i18n via `nestjs-i18n`
- DB: Prisma (schemas in `prisma/`), supports SQLite/PostgreSQL
- Scheduling: `@nestjs/schedule`
- TON: `ton` SDK + TonConnect SDK

## Entry Point
- `src/main.ts` starts a Nest HTTP server (default port 3000).

## Core Modules
- `src/app.module.ts` wires:
  - `TelegramModule` (bot handlers, scenes, middlewares)
  - `DatabaseModule` (Prisma + repositories)
  - `QuizModule` (quiz flow)
  - `TonModule` (TON services)
  - `CloudStorageWebAppModule` (Mini App endpoints)
  - `LanguageModule` (i18n command setup)

## Database Layer
- Prisma models in `prisma/schema.prisma`.
- `TelegramUser.telegramId` is `BigInt` in Prisma schema.
- Repositories:
  - `AbstractRepositoryV3` in `src/database/abstract.repository.v3.ts`
    - Global discovery: repository class name is matched to Prisma model name.
    - Uses patched delegate metadata (`$modelName`) from `PrismaService`.
  - `AbstractRepositoryV2` in `src/database/abstract.repository.v2.ts`
    - Manual delegate getter; kept for documentation/fallback.
  - Concrete repos in `src/database/*-repository/`.
- `PrismaService` patches delegates on construction and connects on module init.

## Telegram Bot Flow
- `src/telegram/bot.update.ts`: general bot updates (poll answers, game menu, quiz session start).
- `src/telegram/bot.admin.update.ts`: admin-only commands:
  - `/cloud_storage_webapp` opens the Mini App.
  - `/ton_balance <address>` fetches TON balance.
  - `/ton_paylink <amount> [comment]` builds a `ton://transfer` link and sends via inline button.
- Scenes in `src/telegram/scenes/` (quiz creation, quiz flow, management).
- Middlewares in `src/telegram/middlewares/`.

## WebApp (Cloud Storage Test)
- WebApp UI: `src/telegram/webapp/cloud-storage.html`.
- Controller: `src/telegram/webapp/cloud-storage-webapp.controller.ts` serves the HTML and verifies `initData`.
- Auth utility: `src/telegram/webapp/webapp-auth.utils.ts`.
- WebApp update handler: `src/telegram/webapp/webapp.update.ts` processes `web_app_data` messages.
- Local setup notes: `src/telegram/webapp/README.md`.
- Requires `TELEGRAM_WEBAPP_URL` and a public HTTPS URL (Cloudflare tunnel, etc).

## TON Integration
- `src/ton/ton.service.ts`
  - `getBalance(address)` via TonCenter endpoint.
  - `buildTransferLink(amount, comment)` returns `ton://transfer/...`.
- `src/ton/ton-wallet-connect.service.ts`
  - TON Connect session management for wallet linking.

## Configuration
- Central config: `configuration/configuration.ts`
- Typed schema: `configuration/validation/configuration.validators.ts`
- Key env vars:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_WEBAPP_URL`
  - `DATABASE_URL`
  - `TON_PAYMENT_ADDRESS`
  - `TON_API_URL`
  - `TON_API_KEY`
  - `TON_TIMEOUT_MS`
  - `TON_CONNECT_MANIFEST_URL`

## Tests
- Database tests: `test/database/`
  - `db-test.utils.ts` provides mock Prisma delegates.
  - `telegram-user.repository.spec.ts` exercises repository discovery + CRUD helpers.

## Resources
- Quiz JSON data in `resources/quiz/`.

## Known Implementation Notes
- Telegram cloud storage is WebApp-only; Bot API cannot access it.
- Prisma uses `BigInt` for Telegram IDs, but some repository methods currently accept `number`.
- `ton://` deep links can be blocked in Telegram clients; inline button is used as a fallback.
