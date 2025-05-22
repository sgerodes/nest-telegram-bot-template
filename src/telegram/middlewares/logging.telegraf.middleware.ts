import { Middleware } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { Logger } from '@nestjs/common';

const logger = new Logger('LoggingMiddleware');

export const loggingMiddleware: Middleware<TelegrafI18nContext> = async (
  ctx: TelegrafI18nContext,
  next,
) => {
  const chatType = ctx.chat?.type;
  const isPublic = 'username' in ctx.chat ? !!ctx.chat.username : false;
  const chatName = 'title' in ctx.chat ? ctx.chat.title : '(no title)';
  logger.debug(
    `Received message from ${ctx.from.id}, username=${ctx?.from?.username} in Chat ID: ${ctx.chat?.id}, Chat Name '${chatName}', Type: ${chatType}, Public: ${isPublic}`,
  );
  await next();
};
