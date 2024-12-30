import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TelegramConfig } from '@configuration/validationAndInterfaces';
import { BotCommands } from '@configuration/telegramConstants';
import * as tg from 'telegraf/src/core/types/typegram';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly i18n: I18nService,
    private readonly telegramConfig: TelegramConfig,
  ) {
    this.logger.log(`Supported languages ${this.getSupportedLanguages()}`);
  }

  getCommandDescriptions(lang: string): tg.BotCommand[] {
    return [
      {
        command: '/' + BotCommands.START,
        description: this.i18n.translate('i18n.command_descriptions.start', { lang }),
      },
      {
        command: '/' + BotCommands.HELLO,
        description: this.i18n.translate('i18n.command_descriptions.hello', { lang }),
      },
    ];
  }

  getSupportedLanguages(): string[] {
    return this.i18n.getSupportedLanguages()
  }

}
