import { Scenes, Telegraf, Context as TelegrafContext } from 'telegraf';
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
  BotCommands,
  TELEGRAM_BTN_ACTIONS,
} from '@configuration/telegramConstants';
import { I18nService, logger } from 'nestjs-i18n';
import { InlineKeyboardButton } from '@telegraf/types';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { TelegramConfig } from '@configuration/configuration.models';
import { LanguageService } from '@language/language.service';
import { I18nTranslations } from '@i18n/i18n.generated';
import { i18nKeys } from '@i18n/i18nKeys';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';

type WizardI18nContext = Scenes.WizardContext & TelegrafI18nContext<I18nTranslations>;

@Update()
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafI18nContext<I18nTranslations>>,
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
    for (const language_code of this.telegramConfig.i18n.enabledLanguages) {
      try {
        await this.bot.telegram.setMyCommands(
          this.languageService.getCommandDescriptions(language_code),
          { language_code },
        );
        await this.bot.telegram.setMyName(
          this.i18n.translate(i18nKeys.i18n.metadata.bot_name, {
            lang: language_code,
          }),
          language_code,
        );
        await this.bot.telegram.setMyShortDescription(
          this.i18n.translate(i18nKeys.i18n.metadata.description, {
            lang: language_code,
          }),
          language_code,
        );
        await this.bot.telegram.setMyDescription(
          this.i18n.translate(i18nKeys.i18n.metadata.short_description, {
            lang: language_code,
          }),
          language_code,
        );
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
    const message = ctx.i18n.translate(i18nKeys.i18n.menus.start.message);
    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.i18n.translate(i18nKeys.i18n.menus.start.buttons.welcome_button),
          url: 'https://t.me/addlist/v_Xq-yXm0yFjY2Ji',
        },
      ],
      [
        {
          text: ctx.i18n.translate(i18nKeys.i18n.shared.buttons.close),
          callback_data: TELEGRAM_BTN_ACTIONS.CLOSE,
        },
      ],
    ];

    await ctx.reply(message, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  @Command(BotCommands.HELLO)
  async helloCommand(@Ctx() ctx: WizardI18nContext) {
    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.i18n.translate(i18nKeys.i18n.shared.buttons.close),
          callback_data: TELEGRAM_BTN_ACTIONS.CLOSE,
        },
      ],
    ];
    const message = ctx.i18n.translate(i18nKeys.i18n.menus.hello.message);
    await ctx.reply(message, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  @Action(TELEGRAM_BTN_ACTIONS.CLOSE)
  async close(@Ctx() ctx: TelegrafI18nContext) {
    await ctx.deleteMessage();
  }
}
