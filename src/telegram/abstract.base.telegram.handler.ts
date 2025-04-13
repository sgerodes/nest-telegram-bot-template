import { Context as TelegrafContext } from 'telegraf';
import {
  Action,
  Ctx,
} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {
  TELEGRAM_BTN_ACTIONS,
} from '@configuration/telegramConstants';
import { InlineKeyboardButton, PollAnswer } from '@telegraf/types';
import { i18nKeys } from '@i18n/i18n.keys';
import { WizardI18nContext } from '@telegram/utils';

export class BaseTelegramHandler {
  protected readonly logger = new Logger(this.constructor.name);

  getCloseButton(ctx: WizardI18nContext): InlineKeyboardButton {
    return {
      text: ctx.t(i18nKeys.i18n.shared.buttons.close),
      callback_data: TELEGRAM_BTN_ACTIONS.CLOSE,
    };
  }
  getLeaveButton(ctx: WizardI18nContext): InlineKeyboardButton {
    return {
      text: ctx.t(i18nKeys.i18n.shared.buttons.close),
      callback_data: TELEGRAM_BTN_ACTIONS.LEAVE,
    };
  }

  @Action(TELEGRAM_BTN_ACTIONS.CLOSE)
  async close(@Ctx() ctx: TelegrafContext) {
    await ctx.deleteMessage();
  }

  @Action(TELEGRAM_BTN_ACTIONS.LEAVE)
  async leaveScene(@Ctx() ctx: WizardI18nContext) {
    await ctx.scene.leave();
  }

}
