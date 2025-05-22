import { Module, Global } from '@nestjs/common';
import { SaveUserMiddleware } from './save-user.middleware';
import { DatabaseModule } from '@database/database.module';
import { TelegramMiddlewareFactory } from '@telegram/middlewares/telegram-middleware.factory';
import { TelegrafI18nModule } from 'nestjs-telegraf-i18n';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';

@Global()
@Module({
  imports: [DatabaseModule, TelegrafI18nModule],
  providers: [SaveUserMiddleware, TelegramMiddlewareFactory, UserRepositoryService],
  exports: [SaveUserMiddleware, TelegramMiddlewareFactory, UserRepositoryService],
})
export class MiddlewareModule {}