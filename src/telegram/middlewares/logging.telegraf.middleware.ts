import { Middleware } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { Logger } from '@nestjs/common';

const logger = new Logger('LoggingMiddleware');

export const loggingMiddleware: Middleware<TelegrafI18nContext> = async (
  ctx: TelegrafI18nContext,
  next,
) => {
  const chat = ctx?.chat;
  const from = ctx?.from;

  let chatType = chat?.type;
  let isPublic = false;
  let chatName = '(no title)';
  let id = ctx && ctx.chat && 'id' in ctx.chat? ctx.chat?.id : null;

  if (chat?.type === 'private' && 'username' in chat) {
    isPublic = !!chat.username;
  }
  if (
    (chat?.type === 'group' || chat?.type === 'supergroup' || chat?.type === 'channel') &&
    'title' in chat
  ) {
    chatName = chat.title;
  }

  logger.debug(
    `Message from username=${ctx?.from?.username} (${ctx.from.id}) in chat '${chatName}' (${id}), Type: ${chatType}, Public: ${isPublic}`,
  );
  await next();
};
