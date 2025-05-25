import {
  Ctx,
  On,
  Update,
} from 'nestjs-telegraf';
import {
  BOT_ON,
} from '@configuration/telegramConstants';
import {  PollAnswer } from '@telegraf/types';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { TelegrafService } from '@telegram/telegraf.service';
import {  WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import {
  PostedQuestionRepositoryService,
} from '@database/quiz-repository/posted-question-repository.service';
import { PostedQuestion, QuizQuestion } from '@prisma/client';
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
    const pollId = BigInt(pollAnswer?.poll_id);

    let postedQuestion: PostedQuestion & { question: QuizQuestion } | null = await this.postedQuestionRepositoryService.readByTelegramMsgIdIncludeQuestion(pollId);
    if (!postedQuestion) {
      this.logger.warn(`Posted question with id '${pollId}' was not found in the db`);
      return;
    }
    const userId = pollAnswer?.user?.id;
    const selectedOption = pollAnswer?.option_ids[0];
    const isCorrect = selectedOption === postedQuestion.question.correctAnswerIndex;

    let user = await this.userRepositoryService.readByTelegramId(userId);

    const userAnswerResponse = await this.userAnswerRepositoryService.createData({
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

}
