import { Injectable } from '@nestjs/common';
import { session } from 'telegraf';
import { loggingMiddleware } from '@telegram/middlewares/logging.telegraf.middleware';
import { TelegrafI18nMiddlewareProvider } from 'nestjs-telegraf-i18n';
import { SaveUserMiddleware } from '@telegram/middlewares/save-user.middleware';

@Injectable()
export class TelegramMiddlewareFactory {
  constructor(
    private readonly i18n: TelegrafI18nMiddlewareProvider,
    private readonly saveUser: SaveUserMiddleware,
  ) {}

  createMiddlewares() {
    return [
      session(),
      this.i18n.telegrafI18nMiddleware,
      this.saveUser.saveUserMiddleware,
      loggingMiddleware,
    ];
  }
}