import { Module, Global } from '@nestjs/common';
import { SaveUserMiddleware } from './save-user.middleware';
import { DatabaseModule } from '@database/database.module';
import { TelegramMiddlewareFactory } from '@telegram/middlewares/telegram-middleware.factory';
import { TelegrafI18nModule } from 'nestjs-telegraf-i18n';

@Global()
@Module({
  imports: [DatabaseModule, TelegrafI18nModule],
  providers: [SaveUserMiddleware, TelegramMiddlewareFactory],
  exports: [SaveUserMiddleware, TelegramMiddlewareFactory],
})
export class MiddlewareModule {}
