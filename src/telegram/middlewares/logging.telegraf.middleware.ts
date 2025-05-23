import { Middleware } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { Logger } from '@nestjs/common';

const logger = new Logger('LoggingMiddleware');

export const loggingMiddleware: Middleware<TelegrafI18nContext> = async (
  ctx: TelegrafI18nContext,
  next,
) => {
  const chat = ctx?.chat;

  const chatType = chat?.type;
  const chatName = chat && 'title' in chat ? chat?.title : null;
  const chatId = ctx?.chat?.id ?? null;
  const isPublic = !!(ctx.chat && 'username' in ctx.chat && ctx.chat.username);

  logger.debug(
    `Message from username=${ctx?.from?.username} (${ctx?.from?.id}) in chat '${chatName}' (${chatId}), Type: ${chatType}, Public: ${isPublic}`,
  );
  await next();
};
