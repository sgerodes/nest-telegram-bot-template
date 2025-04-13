import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { BOT_COMMANDS } from '@configuration/telegramConstants';
import * as tg from 'telegraf/src/core/types/typegram';
import { I18nTranslations } from '@i18n/i18n.generated';
import { i18nKeys } from '@i18n/i18n.keys';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly telegramConfig: TelegramConfig,
  ) {
    this.logger.log(`Supported languages \t${this.getSupportedLanguages()}`);
    this.logger.log(
      `Enabled languages \t${telegramConfig.i18n.enabledLanguages}`,
    );
  }

  getCommandDescriptions(lang: string): tg.BotCommand[] {
    return [
      {
        command: '/' + BOT_COMMANDS.START,
        description: this.i18n.t(i18nKeys.i18n.command_descriptions.start, {
          lang,
        }),
      },
      // {
      //   command: '/' + BOT_COMMANDS.HELLO,
      //   description: this.i18n.t('i18n.command_descriptions.hello', {
      //     lang,
      //   }),
      // },
      {
        command: '/' + BOT_COMMANDS.QUIZ_MANAGER,
        description: this.i18n.t(i18nKeys.i18n.command_descriptions.quiz_manager, {
          lang,
        }),
      },
    ];
  }

  getSupportedLanguages(): string[] {
    return this.i18n.getSupportedLanguages();
  }
}
