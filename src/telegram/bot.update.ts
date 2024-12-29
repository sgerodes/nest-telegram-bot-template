import {Scenes, Telegraf, Context as TelegrafContext} from 'telegraf';
import {Action, Command, Context as NestjsTelegrafContext, InjectBot, Start, Update} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {BotCommands, CommandDescriptions, TELEGRAM_BTN_ACTIONS} from "@configuration/telegramConstants";
import { I18nService } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';
import {UserRepositoryService} from "@database/user-repository/user-repository.service";
import { TelegramBotConfig, TelegramConfig } from '@configuration/validationAndInterfaces';


@Update()
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    private readonly i18n: I18nService,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly telegramConfig: TelegramConfig,
  ) {
    // this.updateDescriptions()
    this.bot.telegram.setMyName(this.telegramConfig.bot.displayName);
    this.bot.telegram.setMyShortDescription(telegramConfig.bot.shortDescription);
    this.bot.telegram.setMyDescription(telegramConfig.bot.description);
    this.bot.telegram.setMyCommands(CommandDescriptions);
  }

  // async updateDescriptions() {
  //   if ((await this.bot.telegram.getMyName()).name !== this.telegramConfig.bot.displayName) {
  //     const previousName = (await this.bot.telegram.getMyName()).name;
  //     await this.bot.telegram.setMyName(this.telegramConfig.bot.displayName);
  //     this.logger.log(`Bot name was changed from '${previousName}' to '${this.telegramConfig.bot.displayName}'`);
  //   }
  // }

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
