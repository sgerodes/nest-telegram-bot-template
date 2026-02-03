import { Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { i18nKeys } from '@i18n/i18n.keys';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';

@Update()
export class BotAdminUpdate extends BaseTelegramHandler {
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
}
