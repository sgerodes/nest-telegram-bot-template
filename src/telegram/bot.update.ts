import {Scenes, Telegraf, Context as TelegrafContext} from 'telegraf';
import { Action, Command, Context as NestjsTelegrafContext, InjectBot, Start, Update} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { BotCommands, TELEGRAM_BTN_ACTIONS} from "@configuration/telegramConstants";
import { I18nService, logger } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';
import {UserRepositoryService} from "@database/user-repository/user-repository.service";
import { TelegramConfig } from '@configuration/validationAndInterfaces';
import { LanguageService } from '../language/language.service';


@Update()
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    private readonly i18n: I18nService,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly telegramConfig: TelegramConfig,
    private readonly languageService: LanguageService,
  ) {
    if (this.telegramConfig.bot.updateMetadata) {
      this.updateMetadata(); // TODO update on metadata change and respect the time to update the metadata
    }
  }

  async updateMetadata() {
    for (const language_code of this.languageService.getSupportedLanguages()) {
      try {
        await this.bot.telegram.setMyName(this.i18n.translate('i18n.metadata.bot_name', { lang: language_code }), language_code);
        await this.bot.telegram.setMyShortDescription(this.i18n.translate('i18n.metadata.description', { lang: language_code }), language_code);
        await this.bot.telegram.setMyDescription(this.i18n.translate('i18n.metadata.short_description', { lang: language_code }), language_code);
        await this.bot.telegram.setMyCommands(this.languageService.getCommandDescriptions(language_code), {language_code});
        logger.log(`Language '${language_code}' updated successfully.`);
      } catch (error) {
        this.logger.error(
          `Failed to update bot metadata for language '${language_code}': ${error.message}`,
          error.stack,
        );
      }
    }
  }


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
      [{ text: await this.i18n.translate('i18n.shared.buttons.close'), callback_data: TELEGRAM_BTN_ACTIONS.CLOSE }],
    ];

    await ctx.reply(
      message, {
        reply_markup: { inline_keyboard: buttons },
      });
  }

  @Command(BotCommands.HELLO)
  async helloCommand(@NestjsTelegrafContext() ctx: Scenes.WizardContext) {
    const buttons: InlineKeyboardButton[][] = [
      [{ text: await this.i18n.translate('i18n.shared.buttons.close'), callback_data: TELEGRAM_BTN_ACTIONS.CLOSE }],
    ];
    const message = this.i18n.translate('i18n.menus.hello.message');
    await ctx.reply(message, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  @Action(TELEGRAM_BTN_ACTIONS.CLOSE)
  async close(ctx) {
    await ctx.deleteMessage();
  }
}
