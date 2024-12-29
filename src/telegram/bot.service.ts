import {Scenes, Telegraf, Context as TelegrafContext} from 'telegraf';
import {Action, Command, Context as NestjsTelegrafContext, InjectBot, Update} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { BotCommands, CommandDescriptions} from "@configuration/telegram";
import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';


@Update()
export class BotService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    private readonly i18n: I18nService,
  ) {
    this.bot.telegram.setMyCommands(CommandDescriptions);
  }

  @Command(BotCommands.START)
  async startCommand(@NestjsTelegrafContext() ctx: Scenes.WizardContext) {

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
