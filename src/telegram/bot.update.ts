import {
  Ctx,
  On,
  Update,
} from 'nestjs-telegraf';
import {
  BOT_ON,
} from '@configuration/telegramConstants';
import { PollAnswer } from '@telegraf/types';
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { TelegrafService } from '@telegram/telegraf.service';
import { WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { PostedQuestionRepository } from '@database/quiz-repository/posted-question.repository';
import { PostedQuestion, QuizQuestion } from '@prisma/client';
import { UserAnswerRepository } from '@database/quiz-repository/user-answer.repository';

@Update()
export class BotUpdate extends BaseTelegramHandler {

  constructor(
    private readonly userRepository: TelegramUserRepository,
    private readonly telegramConfig: TelegramConfig,
    private readonly telegrafService: TelegrafService,
    private readonly postedQuestionRepository: PostedQuestionRepository,
    private readonly userAnswerRepository: UserAnswerRepository,
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

    let postedQuestion: PostedQuestion & { question: QuizQuestion } | null = await this.postedQuestionRepository.readByTelegramMsgIdIncludeQuestion(pollId);
    if (!postedQuestion) {
      this.logger.warn(`Posted question with id '${pollId}' was not found in the db`);
      return;
    }
    const userId: number = pollAnswer?.user?.id;
    const selectedOption = pollAnswer?.option_ids[0];
    const isCorrect = selectedOption === postedQuestion.question.correctAnswerIndex;

    let user = await this.userRepository.readByTelegramId(userId);

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

}
