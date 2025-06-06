import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';
import { I18nService } from 'nestjs-i18n';
import { QuizConfig, TelegramConfig } from '@configuration/validation/configuration.validators';
import { LanguageService } from '@language/language.service';
import { i18nKeys } from '@i18n/i18n.keys';
import { CatchErrors } from '@telegram/decorators';
import { Cacheable } from 'typescript-cacheable';
import { Message } from '@telegraf/types';
import PollMessage = Message.PollMessage;

@Injectable()
export class TelegrafService {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<TelegrafI18nContext<I18nTranslations>>,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly telegramConfig: TelegramConfig,
    private readonly quizConfig: QuizConfig,
    private readonly languageService: LanguageService,
  ) {
    // this.setupListeners();
    this.setupOnErrorLogging()
  }

  setupOnErrorLogging(){
    this.bot.catch((err, ctx) => {
      const username = ctx?.botInfo?.username ?? 'unknown';
      console.error('🔴 Telegraf caught error:', {
        error: err,
        stack: err instanceof Error ? err.stack : undefined,
        ctxType: ctx?.updateType,
        chat: ctx?.chat?.id,
        user: ctx?.from?.id,
      });
    });
  }

  @CatchErrors
  async sendMessageToChatId(chatId: number | string, text: string) {
    this.logger.debug('Trying to send');
    const response = await this.bot.telegram.sendMessage(chatId, text);
    this.logger.debug(`Message sent successfully id=${response.message_id}`);
    return response;
  }

  @CatchErrors
  async getFileByFileId(fileId: string): Promise<Buffer> {
    const fileLink = await this.bot.telegram.getFileLink(fileId);
    const res = await fetch(fileLink.href);
    return Buffer.from(await res.arrayBuffer());
  }

  @CatchErrors
  async sendQuizToChatId(
    chatId: number | string,
    question: string,
    options: string[],
    correctOptionIndex: number,
    photo?: Buffer,
    is_anonymous?: boolean,
    explanation?: string,
    open_period?: Date
  ): Promise<PollMessage> {
    // Non-anonymous cant be send to channels
    if (is_anonymous === null || is_anonymous === undefined) {
      is_anonymous = false;
    }
    if (photo) {
      await this.bot.telegram.sendPhoto(chatId, { source: photo });
    }
    if (question.length > this.quizConfig.maxQuestionLength) {
      const longQuestion: string = question;
      question = "🤔"
      const _responseLongQuestion = await this.sendMessageToChatId(chatId, longQuestion);
    }
    const response = await this.bot.telegram.sendQuiz(
      chatId,
      question,
      options,
      {
        correct_option_id: correctOptionIndex,
        is_anonymous: is_anonymous,
        explanation: explanation,
        open_period: open_period?.getDate() ?? null,
      },
    );
    this.logger.debug(
      `Quiz sent successfully id=${response.poll.id}, name=${await this.getChatNameById(chatId)}`,
    );
    return response;
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
    this.logger.debug(
      `Poll sent successfully id=${response.poll.id}, name=${await this.getChatNameById(chatId)}`,
    );
  }

  @CatchErrors
  async closePoll(chatId: number | string, messageId: number): Promise<void> {
    await this.bot.telegram.stopPoll(chatId, messageId);
    this.logger.debug(`Poll ${messageId} in chat ${chatId} closed.`);
  }

  @CatchErrors
  async pinMessage(chatId: number | string, messageId: number, silent = false) {
    const response = await this.bot.telegram.pinChatMessage(chatId, messageId, {
      disable_notification: silent,
    });
    this.logger.debug(`Pinned message ${messageId} in chat ${chatId}`);
    return response
  }

  @CatchErrors
  async unpinMessage(chatId: number | string, messageId: number) {
    const response = await this.bot.telegram.unpinChatMessage(chatId, messageId);
    this.logger.debug(`Unpinned message ${messageId} in chat ${chatId}`);
    return response
  }

  @CatchErrors
  async getBotName(): Promise<string> {
    const botInfo = await this.bot.telegram.getMe();
    return botInfo.username;
  }

  @CatchErrors
  @Cacheable({ ttl: 5 * 60 * 1000, cacheUndefined: false }) // ttl milliseconds
  async getChatNameById(chatId: number | string): Promise<string | null> {
    const chat = await this.bot.telegram.getChat(chatId);

    if ('title' in chat) {
      return chat.title; // For groups, supergroups, and channels
    }
    if ('username' in chat) {
      return `@${chat.username}`; // For public users or channels with usernames
    }
    if ('first_name' in chat) {
      return chat.first_name; // For private chats
    }
    return null;
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
}
