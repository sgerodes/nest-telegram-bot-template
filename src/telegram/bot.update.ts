import {Scenes, Telegraf, Context as TelegrafContext} from 'telegraf';
import {Action, Command, Context as NestjsTelegrafContext, InjectBot, Start, Update} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {BotCommands, CommandDescriptions, TELEGRAM_BTN_ACTIONS} from "@configuration/telegramConstants";
import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';
import {UserRepositoryService} from "@database/user-repository/user-repository.service";


@Update()
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    private readonly i18n: I18nService,
    private readonly userRepositoryService: UserRepositoryService,
  ) {
    this.bot.telegram.setMyCommands(CommandDescriptions);
  }

  // @Command(BotCommands.START)
  @Start()
  async startCommand(@NestjsTelegrafContext() ctx: Scenes.WizardContext) {


    if (!await this.userRepositoryService.existsByTelegramId(ctx.from.id)) {
      const user = await this.userRepositoryService.createData({
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        telegramFirstName: ctx.from.first_name,
      });
    }

    const message = this.i18n.translate('i18n.menus.start.message');
    const buttons: InlineKeyboardButton[][] = [
      [{
        text: await this.i18n.translate('i18n.menus.start.buttons.welcome_button'),
        url: 'https://t.me/addlist/v_Xq-yXm0yFjY2Ji',
      }],
      [{ text: await this.i18n.translate('i18n.menus.start.buttons.close'), callback_data: TELEGRAM_BTN_ACTIONS.CLOSE }],
    ];

    await ctx.reply(
      message, {
        reply_markup: { inline_keyboard: buttons },
      });
  }

  @Action(TELEGRAM_BTN_ACTIONS.CLOSE)
  async close(ctx) {
    await ctx.deleteMessage();
  }
}
