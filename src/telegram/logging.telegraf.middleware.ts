import { Middleware } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { Logger } from '@nestjs/common';

const logger = new Logger('LoggingMiddleware');

export const loggingMiddleware: Middleware<TelegrafI18nContext> = async (
  ctx: TelegrafI18nContext,
  next,
) => {
  logger.debug(
    `Received message from ${ctx.from.id}, first_name=${ctx?.from?.first_name}, last_name=${ctx?.from?.last_name}, username=${ctx?.from?.username}`,
  );
  await next();
};
