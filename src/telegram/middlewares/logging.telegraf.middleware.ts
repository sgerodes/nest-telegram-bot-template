import { Middleware } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { Logger } from '@nestjs/common';

const logger = new Logger('LoggingMiddleware');

export const loggingMiddleware: Middleware<TelegrafI18nContext> = async (
  ctx: TelegrafI18nContext,
  next,
) => {
  let chatType;
  let isPublic;
  let chatName;
  if (ctx && ctx.chat) {
    chatType = ctx.chat?.type;
    isPublic = 'username' in ctx.chat ? !!ctx.chat.username : false;
    chatName = 'title' in ctx.chat ? ctx.chat.title : '(no title)';
  }
  logger.debug(
    `Message from username=${ctx?.from?.username} (${ctx.from.id}) in chat '${chatName}' (${ctx.chat?.id}), Type: ${chatType}, Public: ${isPublic}`,
  );
  await next();
};
