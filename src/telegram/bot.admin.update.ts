import {
  Command,
  Ctx,
  Help,
  Start,
  Update,
} from 'nestjs-telegraf';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { i18nKeys } from '@i18n/i18n.keys';
import { TelegrafService } from '@telegram/telegraf.service';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { BOT_ADMIN_CHAT_COMMANDS, SCENES } from '@configuration/telegramConstants';
import { TonService } from '../ton/ton.service';

@Update()
export class BotAdminUpdate extends BaseTelegramHandler {

  constructor(
    private readonly telegramConfig: TelegramConfig,
    private readonly telegrafService: TelegrafService,
    private readonly tonService: TonService,
  ) {
    super();
  }

  @Start()
  @AdminOnly()
  async startCommand(@Ctx() ctx: WizardI18nContext) {
    await ctx.reply(ctx.t(i18nKeys.i18n.command.start.message), {
      reply_markup: {
        keyboard: [[{ text: ctx.t(i18nKeys.i18n.games.menu_button) }]],
        resize_keyboard: true,
      },
    });
  }

  @Help()
  @AdminOnly()
  async help(@Ctx() ctx: WizardI18nContext) {
    await ctx.tReply(i18nKeys.i18n.command.help.message);
  }

  @Command(BOT_ADMIN_CHAT_COMMANDS.CREATE_QUESTION)
  @AdminOnly()
  async quizManagerCommand(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`${BOT_ADMIN_CHAT_COMMANDS.CREATE_QUESTION} command received`);
    await ctx.scene.enter(SCENES.SCENE_QUESTION_CREATE);
  }

  @Command(BOT_ADMIN_CHAT_COMMANDS.CLOUD_STORAGE_WEBAPP)
  @AdminOnly()
  async cloudStorageWebApp(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`${BOT_ADMIN_CHAT_COMMANDS.CLOUD_STORAGE_WEBAPP} command received`);
    const baseUrl = this.telegramConfig.webApp?.url;
    if (!baseUrl) {
      await ctx.reply('TELEGRAM_WEBAPP_URL is not configured.');
      return;
    }
    let url: string;
    try {
      url = new URL('/webapp/cloud-storage', baseUrl).toString();
    } catch (error) {
      this.logger.error(`Invalid TELEGRAM_WEBAPP_URL: ${baseUrl}`, error?.stack);
      await ctx.reply('TELEGRAM_WEBAPP_URL is invalid.');
      return;
    }
    await ctx.reply('Open Cloud Storage WebApp:', {
      reply_markup: {
        keyboard: [[{ text: 'Open WebApp', web_app: { url } }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }

  @Command(BOT_ADMIN_CHAT_COMMANDS.TON_BALANCE)
  @AdminOnly()
  async tonBalance(@Ctx() ctx: WizardI18nContext) {
    const message = ctx.message;
    const text = message && 'text' in message ? message.text : '';
    const [, address] = text.trim().split(/\s+/);

    if (!address) {
      await ctx.reply('Usage: /ton_balance <address>');
      return;
    }

    try {
      const balanceNano = await this.tonService.getBalance(address);
      const formatted = this.formatTon(balanceNano);
      await ctx.reply(
        `Balance for ${address}:\n` +
          `${balanceNano.toString()} nanotons\n` +
          `${formatted} TON`,
      );
    } catch (error) {
      const message = error?.message ?? 'Failed to fetch balance';
      await ctx.reply(message);
    }
  }

  @Command(BOT_ADMIN_CHAT_COMMANDS.TON_PAYLINK)
  @AdminOnly()
  async tonPaylink(@Ctx() ctx: WizardI18nContext) {
    const message = ctx.message;
    const text = message && 'text' in message ? message.text : '';
    const parts = text.trim().split(/\s+/);
    const amount = parts[1];
    const comment = parts.slice(2).join(' ') || undefined;

    if (!amount) {
      await ctx.reply('Usage: /ton_paylink <amount> [comment]');
      return;
    }

    try {
      const link = this.tonService.buildTransferLink(amount, comment);
      await ctx.reply('Open payment in your wallet:', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Pay in TON wallet', url: link }]],
        },
      });
      await ctx.reply(`Payment link (fallback):\n${link}`);
    } catch (error) {
      const reply = error?.message ?? 'Failed to build payment link';
      await ctx.reply(reply);
    }
  }

  private formatTon(balanceNano: bigint): string {
    const whole = balanceNano / 1_000_000_000n;
    const fraction = balanceNano % 1_000_000_000n;
    const padded = fraction.toString().padStart(9, '0');
    return `${whole}.${padded}`;
  }
}
