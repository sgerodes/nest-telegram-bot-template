import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from '@telegram/bot.update';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { DatabaseModule } from '@database/database.module';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { LanguageModule } from '@language/language.module';
import { TelegrafI18nModule, TelegrafI18nContext, } from 'nestjs-telegraf-i18n';
import { TelegrafService } from '@telegram/telegraf.service';
import { SceneQuizManager } from '@telegram/scenes/quizManagerScene.scene';
import { BotAdminUpdate } from '@telegram/bot.admin.update';
import { MiddlewareModule } from '@telegram/middlewares/middleware.module';
import { TelegramMiddlewareFactory } from '@telegram/middlewares/telegram-middleware.factory';
import { SceneQuiz } from '@telegram/scenes/quiz.scene';
import { SceneQuizCreate } from '@telegram/scenes/quizCreate.scene';

@Module({
  imports: [
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
  providers: [UserRepositoryService, BotUpdate, TelegrafService, BotAdminUpdate, SceneQuizCreate],
})
export class TelegramModule {}
