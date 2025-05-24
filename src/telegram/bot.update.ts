import { Context as TelegrafContext } from 'telegraf';
import {
  Action,
  Command,
  // Context as NestjsTelegrafContext,
  Ctx,
  Hears,
  Help,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {
  BOT_ADMIN_CHAT_COMMANDS,
  BOT_COMMANDS,
  BOT_ON,
  SCENES,
  TELEGRAM_BTN_ACTIONS,
} from '@configuration/telegramConstants';
import { InlineKeyboardButton, PollAnswer } from '@telegraf/types';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { i18nKeys } from '@i18n/i18n.keys';
import { TelegrafService } from '@telegram/telegraf.service';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { GroupChatOnly, PrivateChatOnly } from '@telegram/decorators';
import { I18nTranslations } from '@i18n/i18n.generated';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import {
  PostedQuestionRepositoryService,
} from '@database/quiz-repository/posted-question-repository.service';
import { PostedQuestion } from '@prisma/client';
import { UserAnswerRepositoryService } from '@database/quiz-repository/user-answer-repository.service';

@Update()
export class BotUpdate extends BaseTelegramHandler {

  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly telegramConfig: TelegramConfig,
    private readonly telegrafService: TelegrafService,
    private readonly postedQuestionRepositoryService: PostedQuestionRepositoryService,
    private readonly userAnswerRepositoryService: UserAnswerRepositoryService,
  ) {
    super();
    if (this.telegramConfig.bot.updateMetadata) {
      telegrafService.updateMetadata(); // TODO update on metadata change and respect the time to update the metadata
    }
    telegrafService.getBotName().then((botName) => {
      this.logger.log(`Starting bot '${botName}'`);
    });
  }

  @On(BOT_ON.POLL_ANSWER)
  async onPollAnswer(@Ctx() ctx: WizardI18nContext) {
    const pollAnswer: PollAnswer = ctx.pollAnswer;
    const pollId = pollAnswer?.poll_id;
    const pollIdInt = Number.parseInt(pollId, 10);
    if (isNaN(pollIdInt)) {
      this.logger.warn(`Invalid poll ID: ${pollId}`);
      return;
    }

    let postedQuestion = await this.postedQuestionRepositoryService.readByIdIncludeQuestion(pollIdInt);
    if (!postedQuestion) {
      this.logger.warn(`Posted question with id '${pollId}' not found in the db`);
      return;
    }
    const userId = pollAnswer?.user?.id;
    const selectedOption = pollAnswer?.option_ids[0];
    const isCorrect = selectedOption === postedQuestion.question.correctAnswerIndex;


    const userAnswerResponse = await this.userAnswerRepositoryService.createData({
      user: { connect: { id: userId } },
      postedQuestion: { connect: { id: postedQuestion.id } },
      selectedIdx: selectedOption,
      isCorrect,
    })
    if (!userAnswerResponse) {
      this.logger.warn(`Could not save user answer of user ${userId} to poll ${pollId}`)
      return;
    }
    this.logger.debug(
      `User ${userId} answered poll ${pollId} with option ${selectedOption}`,
    );
  }



  // @Start()
  // @AdminOnly()
  // @PrivateChatOnly()
  // async startCommand(@Ctx() ctx: WizardI18nContext) {
  //   if (!(await this.userRepositoryService.existsByTelegramId(ctx.from.id))) {
  //     const _user = await this.userRepositoryService.createData({
  //       telegramId: ctx.from.id,
  //       username: ctx.from.username,
  //       firstName: ctx.from.first_name,
  //       lastName: ctx.from.last_name
  //     });
  //   }
  //   const message = ctx.t(i18nKeys.i18n.command.start.message);
  //   const buttons: InlineKeyboardButton[][] = [
  //     [
  //       {
  //         text: ctx.t(i18nKeys.i18n.command.start.buttons.welcome_button),
  //         url: 'https://t.me/addlist/v_Xq-yXm0yFjY2Ji',
  //       },
  //     ],
  //     [this.getCloseButton(ctx)],
  //   ];
  //
  //   await ctx.reply(message, {
  //     reply_markup: { inline_keyboard: buttons },
  //   });
  // }

  @Command(BOT_COMMANDS.QUIZ)
  async quizCommand(@Ctx() ctx: WizardI18nContext) {
    await ctx.scene.enter(SCENES.SCENE_QUIZ);
  }


  //
  // @Command(BOT_COMMANDS.HELLO)
  // @PrivateChatOnly()
  // async helloCommand(@Ctx() ctx: WizardI18nContext) {
  //   const message = ctx.t(i18nKeys.i18n.command.hello.message);
  //   await ctx.reply(message);
  //   await ctx.scene.enter(SCENES.SCENE_HELLO);
  // }

  // @Command(BOT_ADMIN_CHAT_COMMANDS.CREATE_QUIZ)
  // @AdminOnly()
  // async quizManagerCommand(@Ctx() ctx: WizardI18nContext) {
  //   await ctx.scene.enter(SCENES.SCENE_QUIZ_MANAGER);
  //   // await ctx.scene.enter(SCENES.SCENE_QUIZ_MANAGER, {}, true);
  // }

  // @Hears(new RegExp('^getById (-?\\d+)$'))
  // async hearsGetById(@Ctx() ctx: WizardI18nContext) {
  //   const match = ctx.text.match(/^getById (-?\d+)$/);
  //   if (!match) {
  //     await ctx.reply('❌ Invalid format! Use: getById <chat_id>');
  //     return;
  //   }
  //
  //   const chatId = parseInt(match[1], 10);
  //   const chatName = await this.telegrafService.getChatNameById(chatId);
  //
  //   if (chatName) {
  //     await ctx.reply(`✅ Chat Name: ${chatName}`);
  //   } else {
  //     await ctx.reply(
  //       '❌ Unable to retrieve chat name. The bot might not have access.',
  //     );
  //   }
  // }

}
