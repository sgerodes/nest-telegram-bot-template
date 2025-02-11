import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from '@telegram/bot.update';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { DatabaseModule } from '@database/database.module';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { LanguageModule } from '@language/language.module';
import {
  TelegrafI18nModule,
  TelegrafI18nMiddlewareProvider,
  TelegrafI18nContext,
} from 'nestjs-telegraf-i18n';
import { session } from 'telegraf';
import { TelegrafService } from '@telegram/telegraf.service';
import { loggingMiddleware } from '@telegram/logging.telegraf.middleware';
import {SceneHello} from "@telegram/scenes/hello.scene";

@Module({
  imports: [
    TelegrafI18nModule,
    TelegrafModule.forRootAsync({
      inject: [TelegramConfig, TelegrafI18nMiddlewareProvider],
      useFactory: (
        telegramConfig: TelegramConfig,
        telegrafI18nMiddlewareProvider: TelegrafI18nMiddlewareProvider,
      ) => ({
        token: telegramConfig.bot.token,
        options: {
          contextType: TelegrafI18nContext,
        },
        middlewares: [
          session(),
          telegrafI18nMiddlewareProvider.telegrafI18nMiddleware,
          loggingMiddleware,
        ],
      }),
    }),
    DatabaseModule,
    LanguageModule,
  ],
  providers: [UserRepositoryService, BotUpdate, SceneHello, TelegrafService],
})
export class TelegramModule {}
