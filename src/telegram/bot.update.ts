import {
  Telegraf,
  Context as TelegrafContext,
} from 'telegraf';
import {
  Action,
  Command,
  // Context as NestjsTelegrafContext,
  Ctx,
  InjectBot,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {
  BOT_COMMANDS, SCENES,
  TELEGRAM_BTN_ACTIONS,
} from '@configuration/telegramConstants';
import { I18nService, logger } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { LanguageService } from '@language/language.service';
import { I18nTranslations } from '@i18n/i18n.generated';
import { i18nKeys } from '@i18n/i18n.keys';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { WizardI18nContext } from '@telegram/types';


@Update()
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot()
    private readonly bot: Telegraf<TelegrafI18nContext<I18nTranslations>>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly userRepositoryService: UserRepositoryService,
    private readonly telegramConfig: TelegramConfig,
    private readonly languageService: LanguageService,
  ) {
    if (this.telegramConfig.bot.updateMetadata) {
      this.updateMetadata(); // TODO update on metadata change and respect the time to update the metadata
    }
  }

  async updateMetadata() {
    const default_language_code = ''; // Will default to the fallback language of i18n
    const enabledLanguages = [default_language_code, ...this.telegramConfig.i18n.enabledLanguages];
    for (const language_code of enabledLanguages) {
      try {
        const commandDescriptions = this.languageService.getCommandDescriptions(language_code);
        this.logger.debug(`Setting commandDescriptions for '${language_code}'`);
        await this.bot.telegram.setMyCommands(commandDescriptions, { language_code });

        const myName = this.i18n.t(i18nKeys.i18n.metadata.bot_name, { lang: language_code, });
        this.logger.debug(`Setting myName for '${language_code}' to: '${myName}'`);
        await this.bot.telegram.setMyName(myName, language_code);

        const description = this.i18n.t(i18nKeys.i18n.metadata.description, { lang: language_code, });
        this.logger.debug(`Setting description for '${language_code}' to: '${description}'`);
        await this.bot.telegram.setMyShortDescription(description, language_code);

        const short_description = this.i18n.t(i18nKeys.i18n.metadata.description, { lang: language_code, });
        this.logger.debug(`Setting short_description for '${language_code}' to: '${short_description}'`);
        await this.bot.telegram.setMyDescription(short_description, language_code,);

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
  async startCommand(@Ctx() ctx: WizardI18nContext) {
    if (!(await this.userRepositoryService.existsByTelegramId(ctx.from.id))) {
      const _user = await this.userRepositoryService.createData({
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        telegramFirstName: ctx.from.first_name,
      });
    }
    const message = ctx.i18n.t(i18nKeys.i18n.menus.start.message);
    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.i18n.t(
            i18nKeys.i18n.menus.start.buttons.welcome_button,
          ),
          url: 'https://t.me/addlist/v_Xq-yXm0yFjY2Ji',
        },
      ],
      [
        this.getDeleteButton(ctx),
      ],
    ];

    await ctx.reply(message, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  @Command(BOT_COMMANDS.HELLO)
  async helloCommand(@Ctx() ctx: WizardI18nContext) {
    const message = ctx.i18n.t(i18nKeys.i18n.menus.hello.message);
    await ctx.reply(message);
    await ctx.scene.enter(SCENES.SCENE_HELLO)
  }

  getDeleteButton(ctx: WizardI18nContext): InlineKeyboardButton {
    return {
      text: ctx.i18n.t(i18nKeys.i18n.shared.buttons.close),
      callback_data: TELEGRAM_BTN_ACTIONS.CLOSE,
    }
  }

  @Action(TELEGRAM_BTN_ACTIONS.CLOSE)
  async close(@Ctx() ctx: TelegrafContext) {
    await ctx.deleteMessage();
  }
}
