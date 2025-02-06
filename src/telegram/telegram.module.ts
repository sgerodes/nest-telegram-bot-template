import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from '@telegram/bot.update';
import { TelegramConfig } from '@configuration/configuration.models';
import { DatabaseModule } from '@database/database.module';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { LanguageModule } from '@language/language.module';
import {
  TelegrafI18nContext,
  TelegrafI18nMiddleware,
} from 'nestjs-telegraf-i18n';
import { session } from 'telegraf';
import { SceneHello } from '../scenes/hello.scene';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [TelegramConfig],
      useFactory: (telegramConfig: TelegramConfig) => ({
        token: telegramConfig.bot.token,
        options: {
          contextType: TelegrafI18nContext,
        },
        middlewares: [
          session()
        ],
      }),
    }),
    DatabaseModule,
    LanguageModule,
  ],
  providers: [BotUpdate, UserRepositoryService, TelegrafI18nMiddleware, SceneHello],
})
export class TelegramModule {}

