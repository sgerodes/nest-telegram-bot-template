import {
  Action,
  Ctx,
  Hears,
  On,
  Update,
} from 'nestjs-telegraf';
import {
  BOT_ON,
  TELEGRAM_BTN_ACTIONS,
} from '@configuration/telegramConstants';
import { PollAnswer } from '@telegraf/types';
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';
import { QuizConfig, TelegramConfig } from '@configuration/validation/configuration.validators';
import { TelegrafService } from '@telegram/telegraf.service';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { PostedQuestionRepository } from '@database/quiz-repository/posted-question.repository';
import { PostedQuestion, QuizQuestion } from '@prisma/client';
import { UserAnswerRepository } from '@database/quiz-repository/user-answer.repository';
import { SessionQuizService, SessionStartResult } from '../quiz/session-quiz/session-quiz.service';
import { i18nKeys } from '@i18n/i18n.keys';

@Update()
export class BotUpdate extends BaseTelegramHandler {

  constructor(
    private readonly userRepository: TelegramUserRepository,
    private readonly telegramConfig: TelegramConfig,
    private readonly quizConfig: QuizConfig,
    private readonly telegrafService: TelegrafService,
    private readonly postedQuestionRepository: PostedQuestionRepository,
    private readonly userAnswerRepository: UserAnswerRepository,
    private readonly sessionQuizService: SessionQuizService,
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
    const pollId = BigInt(pollAnswer?.poll_id);

    let postedQuestion: PostedQuestion & { question: QuizQuestion } | null = await this.postedQuestionRepository.findByTelegramMsgIdWithQuestion(pollId);
    if (!postedQuestion) {
      this.logger.warn(`Posted question with id '${pollId}' was not found in the db`);
      return;
    }
    const userId: number = pollAnswer?.user?.id;
    const selectedOption = pollAnswer?.option_ids[0];
    const isCorrect = selectedOption === postedQuestion.question.correctAnswerIndex;

    let user = await this.userRepository.findByTelegramId(userId);

    const userAnswerResponse = await this.userAnswerRepository.createData({
      user: { connect: { id: user.id } },
      postedQuestion: { connect: { id: postedQuestion.id } },
      selectedIdx: selectedOption,
      isCorrect,
    })
    if (!userAnswerResponse) {
      this.logger.warn(`Could not save user answer of user ${userId} to poll ${pollId}`)
      return;
    }
    this.logger.debug(
      `User ${user.username} (${user.telegramId}) answered poll ${pollId} with option ${selectedOption}. Is correct: ${isCorrect}`,
    );
  }

  @Hears(/^🎮 Games$/)
  @AdminOnly()
  async onGamesMenu(@Ctx() ctx: WizardI18nContext) {
    const rounds = this.quizConfig.sessionDefaultRounds;
    await ctx.reply(ctx.t(i18nKeys.i18n.games.select_game), {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ctx.t(i18nKeys.i18n.games.quiz_session.button, { args: { rounds } }) as string,
              callback_data: TELEGRAM_BTN_ACTIONS.START_QUIZ_SESSION,
            },
          ],
        ],
      },
    });
  }

  @Action(TELEGRAM_BTN_ACTIONS.START_QUIZ_SESSION)
  @AdminOnly()
  async onStartQuizSession(@Ctx() ctx: WizardI18nContext) {
    await ctx.answerCbQuery();
    const userId = ctx.from?.id;
    const chatId = ctx.chat?.id;

    if (!userId || !chatId) {
      this.logger.warn('Could not determine userId or chatId for quiz session');
      return;
    }

    const result = await this.sessionQuizService.startSession(userId, chatId);

    if (result === SessionStartResult.NO_QUESTIONS) {
      await ctx.tReply(i18nKeys.i18n.games.quiz_session.no_questions);
    }
  }

}
