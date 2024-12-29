import { Injectable, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { TelegramConfig } from '@configuration/validationAndInterfaces';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly i18n: I18nService,
    private readonly telegramConfig: TelegramConfig,
  ) {
    this.logger.log(`SupportedLanguages ${this.getSupportedLanguages()}`);
  }

  getSupportedLanguages(): string[] {
    return this.i18n.getSupportedLanguages()
  }

}
