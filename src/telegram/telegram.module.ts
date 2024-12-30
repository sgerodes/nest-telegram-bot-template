import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotUpdate } from '@telegram/bot.update';
import { TelegramConfig } from '@configuration/validationAndInterfaces';
import { DatabaseModule } from '@database/database.module';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { LanguageModule } from '../language/language.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      inject: [TelegramConfig],
      useFactory: (telegramConfig: TelegramConfig) => ({
        token: telegramConfig.bot.token,
      }),
    }),
    DatabaseModule,
    LanguageModule,
  ],
  providers: [BotUpdate, UserRepositoryService],
})
export class TelegramModule {}
