import { Scenes } from 'telegraf';
import { Action, Command, Context, Update } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {BotCommands} from "../../configuration/configuration";
import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';
import { InputMediaPhoto } from 'telegraf/types';

@Update()
export class BotService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly i18n: I18nService,
  ) {}

  @Command(BotCommands.START)
  async startCommand(@Context() ctx: Scenes.WizardContext) {

    const message = this.i18n.translate('i18n.menus.start.message');
    const buttons: InlineKeyboardButton[][] = [
      [{
        text: await this.i18n.translate('i18n.menus.start.buttons.welcome_button'),
        url: 'https://t.me/addlist/v_Xq-yXm0yFjY2Ji',
      }],
      [{ text: await this.i18n.translate('i18n.menus.start.buttons.close'), callback_data: 'close' }],
    ];

    await ctx.reply(
      message, {
        reply_markup: { inline_keyboard: buttons },
      });

  }


  @Action('correct_answer')
  async correctAnswer(ctx) {
    await ctx.reply('Correct!');
  }

  @Action('wrong_answer')
  async wrongAnswer(ctx) {
    await ctx.reply('Wrong answer!');
  }

  @Action('close')
  async close(ctx) {
    await ctx.deleteMessage();
  }
}
