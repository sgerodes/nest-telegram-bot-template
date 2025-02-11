import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { LanguageService } from '@language/language.service';
import { i18nKeys } from '@i18n/i18n.keys';
import {CatchErrors} from "@telegram/decorators";

@Injectable()
export class TelegrafService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<TelegrafI18nContext<I18nTranslations>>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly telegramConfig: TelegramConfig,
    private readonly languageService: LanguageService,
  ) {
    if (this.telegramConfig.bot.updateMetadata) {
      this.updateMetadata(); // TODO update on metadata change and respect the time to update the metadata
    }
  }

  async updateMetadata() {
    // Will default to the fallback language of i18n and will update the default lang of the telegram bot
    const default_language_code = '';
    const enabledLanguages = [
      default_language_code,
      ...this.telegramConfig.i18n.enabledLanguages,
    ];
    for (const language_code of enabledLanguages) {
      try {
        const commandDescriptions =
          this.languageService.getCommandDescriptions(language_code);
        this.logger.debug(`Setting commandDescriptions for '${language_code}'`);
        await this.bot.telegram.setMyCommands(commandDescriptions, {
          language_code,
        });

        const myName = this.i18n.t(i18nKeys.i18n.metadata.bot_name, {
          lang: language_code,
        });
        this.logger.debug(
          `Setting myName for '${language_code}' to: '${myName}'`,
        );
        await this.bot.telegram.setMyName(myName, language_code);

        const description = this.i18n.t(i18nKeys.i18n.metadata.description, {
          lang: language_code,
        });
        this.logger.debug(
          `Setting description for '${language_code}' to: '${description}'`,
        );
        await this.bot.telegram.setMyShortDescription(
          description,
          language_code,
        );

        const short_description = this.i18n.t(
          i18nKeys.i18n.metadata.description,
          { lang: language_code },
        );
        this.logger.debug(
          `Setting short_description for '${language_code}' to: '${short_description}'`,
        );
        await this.bot.telegram.setMyDescription(
          short_description,
          language_code,
        );

        this.logger.log(`Language '${language_code}' updated successfully.`);
      } catch (error) {
        this.logger.error(
          `Failed to update bot metadata for language '${language_code}': ${error.message}`,
          error.stack,
        );
      }
    }
  }

  @CatchErrors
  async sendMessageToChatId(chatId: number | string, text: string) {
    this.logger.debug('Trying to send');
    const response = await this.bot.telegram.sendMessage(chatId, text);
    this.logger.debug(`Message sent successfully id=${response.message_id}`);
  }

  @CatchErrors
  async sendQuizToChatId(
    chatId: number | string,
    question: string,
    options: string[],
    correctOptionIndex: number,
    is_anonymous?: boolean,
    explanation?: string,
  ) {
    // Non-anonymous cant be send to channels
    this.logger.debug('Sending the quiz');
    const response = await this.bot.telegram.sendQuiz(
        chatId,
        question,
        options,
        {
          correct_option_id: correctOptionIndex,
          is_anonymous: is_anonymous,
          explanation: explanation,
        },
    );
    this.logger.debug(`Quiz sent successfully id=${response.poll.id}`);
  }

  @CatchErrors
  async sendPollToChatId(
    chatId: number | string,
    question: string,
    options: string[],
    is_anonymous?: boolean,
    explanation?: string,
  ) {
    // Non-anonymous cant be send to channels
    this.logger.debug('Sending the poll');
    const response = await this.bot.telegram.sendPoll(
        chatId,
        question,
        options,
        {
          is_anonymous: is_anonymous,
          explanation: explanation,
        },
    );
    this.logger.debug(`Poll sent successfully id=${response.poll.id}`);
  }
}
