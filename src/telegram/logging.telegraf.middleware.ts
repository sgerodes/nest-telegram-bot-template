import { Middleware } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import {Logger} from "@nestjs/common";

const WHITELISTED_USERS: number[] = [123456789, 987654321]; // Replace with actual Telegram user IDs

const logger = new Logger('LoggingMiddleware');

export const loggingMiddleware: Middleware<TelegrafI18nContext> = async (ctx: TelegrafI18nContext, next) => {
    logger.debug(`Received message from ${ctx.from.id}`);
    await next();
};