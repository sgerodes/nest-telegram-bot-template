# Project Context (LLM Summary)

Concise, high-signal overview to help future contributors or LLMs understand the project quickly.

## What This Project Is
- NestJS-based Telegram bot template with quiz features, admin utilities, and TON blockchain integration.

## Tech Stack
- Backend: NestJS, TypeScript
- Bot: Telegraf via `nestjs-telegraf`, i18n via `nestjs-i18n` and `nestjs-telegraf-i18n`. Currently implement only english translations. Other will be added in the future.
- DB: Prisma (schemas in `prisma/`), supports SQLite for local development and PostgreSQL for production. It has a custom generic abstract repository for convenience `src/database/abstract.repository.v3.ts`
- TON: `ton` SDK + TonConnect SDK
- Logging: use `protected readonly logger = new Logger(this.constructor.name);` for logging in services. The app shoudl have maningful logging, but also not overcomplicating or overlogging. Only what can be useful for development and debugging. Use logger levels approriately. 

## Entry Point
- `src/main.ts` starts a Nest HTTP server (default port 3000).

## Core Modules
- `src/app.module.ts` wires:
  - `TelegramModule` (bot handlers, scenes, middlewares)
  - `DatabaseModule` (Prisma + repositories)
  - `QuizModule` (quiz flow: scheduled + session-based)
  - `TonModule` (TON services)
  - `LanguageModule` (i18n command setup)

### Quiz Module (High-Level)
- `src/quiz/quiz.module.ts` groups all quiz-related services:
  - `QuizService` for generic quiz utilities.
  - `ScheduledQuizService` for cron-like scheduled quizzes.
  - `SessionQuizService` for interactive, per-user quiz sessions.
- Session-based quizzes:
  - `SessionQuizService` (`src/quiz/session-quiz/session-quiz.service.ts`) creates `UserQuizSession` records and links them to `UserQuizSessionQuestion` entities.
  - Questions are selected randomly from `QuizQuestion` using `sessionDefaultRounds` from configuration.
  - Each question is posted via `TelegrafService.sendQuizToChatId`, and the posted poll is tracked in `PostedQuestion`.
- Scheduled quizzes:
  - `ScheduledQuizService` (`src/quiz/scheduled-quiz/scheduled-quiz.service.ts`) uses `ScheduledQuiz` + `PostedQuestion` models to send quizzes at specific times.
  - `@nestjs/schedule` (`ScheduleModule.forRoot()` in `AppModule`) powers cron/interval jobs that call this service.

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
- `src/telegram/quiz.update.ts`: quiz-related admin commands (e.g., entering quiz creation scenes).
- Scenes in `src/telegram/scenes/` (quiz creation, quiz flow, management).
- Middlewares in `src/telegram/middlewares/`.

### Telegraf Abstractions
- `TelegrafService` (`src/telegram/telegraf.service.ts`) is the main abstraction for interacting with the Telegram Bot API (sending quizzes, messages, etc.).
- `BaseTelegramHandler` (`src/telegram/abstract.base.telegram.handler.ts`) provides shared behavior (including a logger) for update handlers like `bot.update.ts`, `bot.admin.update.ts`, and `quiz.update.ts`.

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
- Quiz config:
  - `QuizConfig` (part of the typed configuration) controls quiz behavior such as `sessionDefaultRounds`, injected into `SessionQuizService`.
- I18n config:
  - `TelegramI18nConfig` (from `configuration.validators.ts`) is injected into `I18nModule.forRootAsync` to configure `fallbackLanguage`, `fallbacks`, `i18nFolderPath`, and `typesOutputPath`.

## Tests
- Database tests: `test/database/`
  - `db-test.utils.ts` provides mock Prisma delegates.
  - `telegram-user.repository.spec.ts` exercises repository discovery + CRUD helpers.
- Quiz tests:
  - `src/quiz/quiz.service.spec.ts` for generic quiz logic.
  - `src/quiz/session-quiz/session-quiz.service.spec.ts` for session-based quiz flow.
- TON tests:
  - `src/ton/ton.service.spec.ts` for TON integration logic.
- E2E tests:
  - `test/app.e2e-spec.ts` for Nest application end-to-end behavior.

## Resources
- Quiz JSON data in `resources/quiz/`.

## I18n Tooling
- I18n files live under `configuration/i18n/`:
  - `i18n.json` per locale (e.g., `en`, `pt`, `ru`).
  - `generate.i18n.keys.ts` + `i18n.generated.ts` + `i18n.keys.ts` provide type-safe i18n keys.
  - `i18n-keys-validation-service` (`src/language/i18n-keys-validation-service/`) validates that keys exist and are consistent across locales.

## Code Standards & Architecture Guidelines

### Configuration Management
- **No inline defaults**: Never use fallback values like `process.env.VAR || 'default'` in service code.
- **Centralized configuration**: All environment variables go through `configuration/configuration.ts` with validation in `configuration/validation/configuration.validators.ts`.
- **Fail fast**: Required variables must fail validation at startup if missing - no silent defaults.

### Separation of Concerns
- **Single responsibility**: Each file/class should focus on one domain or feature.
- **Avoid bloated handlers**: Split Telegram update handlers by feature (e.g., `quiz.update.ts`, `bot.admin.update.ts`).
- **Domain isolation**: Related functionality should be grouped in dedicated modules.

### Comments Policy
- **Minimal comments**: Code should be self-explanatory through clear naming and structure.
- **No format documentation**: Don't use comments to describe expected formats (e.g., "URL should be like...").
- **Why, not what**: Comments are only acceptable when explaining *why* something unusual is done, not *what* the code does.

### Clean Code
- **Consistent patterns**: Follow existing patterns in the codebase for similar functionality.

## Known Implementation Notes
- Telegram cloud storage is WebApp-only; Bot API cannot access it.
- Prisma uses `BigInt` for Telegram IDs, but some repository methods currently accept `number`.
- `ton://` deep links can be blocked in Telegram clients; inline button is used as a fallback.
