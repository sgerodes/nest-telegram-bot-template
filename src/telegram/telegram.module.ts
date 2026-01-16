import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from '@telegram/bot.update';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { DatabaseModule } from '@database/database.module';
import { LanguageModule } from '@language/language.module';
import { TelegrafI18nModule, TelegrafI18nContext, } from 'nestjs-telegraf-i18n';
import { TelegrafService } from '@telegram/telegraf.service';
import { BotAdminUpdate } from '@telegram/bot.admin.update';
import { MiddlewareModule } from '@telegram/middlewares/middleware.module';
import { TelegramMiddlewareFactory } from '@telegram/middlewares/telegram-middleware.factory';
import { SceneQuizCreate } from '@telegram/scenes/quizCreate.scene';
import { WebAppUpdate } from '@telegram/webapp/webapp.update';

@Module({
  imports: [
    HttpModule,
    TelegrafI18nModule,
    DatabaseModule,
    MiddlewareModule,
    TelegrafModule.forRootAsync({
      inject: [
        TelegramConfig,
        TelegramMiddlewareFactory,
      ],
      useFactory: (
        telegramConfig: TelegramConfig,
        middlewareFactory: TelegramMiddlewareFactory,
      ) => ({
        token: telegramConfig.bot.token,
        options: {
          contextType: TelegrafI18nContext,
        },
        middlewares: middlewareFactory.createMiddlewares(),
      }),
    }),
    LanguageModule,
  ],
  providers: [
    BotUpdate,
    TelegrafService,
    BotAdminUpdate,
    SceneQuizCreate,
    WebAppUpdate,
  ],
  exports: [TelegrafService],
})
export class TelegramModule {}
