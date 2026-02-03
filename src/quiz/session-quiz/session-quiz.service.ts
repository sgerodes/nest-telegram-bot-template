import { Injectable, Logger } from '@nestjs/common';
import { QuizConfig } from '@configuration/validation/configuration.validators';
import { TelegrafService } from '@telegram/telegraf.service';
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';
import { QuizQuestionRepository } from '@database/quiz-repository/quiz-question.repository';
import { PostedQuestionRepository } from '@database/quiz-repository/posted-question.repository';
import { UserQuizSessionRepository } from '@database/quiz-repository/user-quiz-session.repository';
import { UserQuizSessionQuestionRepository } from '@database/quiz-repository/user-quiz-session-question.repository';
import { AnswerMode, QuizQuestion } from '@prisma/client';
import { shuffleArray } from '@telegram/utils';

export enum SessionStartResult {
  SUCCESS = 'success',
  USER_NOT_FOUND = 'user_not_found',
  NO_QUESTIONS = 'no_questions',
}

@Injectable()
export class SessionQuizService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly quizConfig: QuizConfig,
    private readonly telegrafService: TelegrafService,
    private readonly userRepository: TelegramUserRepository,
    private readonly quizQuestionRepository: QuizQuestionRepository,
    private readonly postedQuestionRepository: PostedQuestionRepository,
    private readonly userQuizSessionRepository: UserQuizSessionRepository,
    private readonly userQuizSessionQuestionRepository: UserQuizSessionQuestionRepository,
  ) {}

  async startSession(telegramUserId: number, chatId: number, rounds?: number): Promise<SessionStartResult> {
    const numRounds = rounds ?? this.quizConfig.sessionDefaultRounds;

    const user = await this.userRepository.findByTelegramId(telegramUserId);
    if (!user) {
      this.logger.warn(`User with telegramId ${telegramUserId} not found`);
      return SessionStartResult.USER_NOT_FOUND;
    }

    const questions = await this.selectRandomQuestions(numRounds);
    if (questions.length === 0) {
      return SessionStartResult.NO_QUESTIONS;
    }

    const session = await this.userQuizSessionRepository.createData({
      user: { connect: { id: user.id } },
    });

    for (let i = 0; i < questions.length; i++) {
      await this.userQuizSessionQuestionRepository.createData({
        session: { connect: { id: session.id } },
        question: { connect: { id: questions[i].id } },
        order: i + 1,
      });
    }

    this.logger.log(`Created quiz session ${session.id} for user ${user.id} with ${questions.length} questions`);

    await this.postNextQuestion(session.id, chatId);
    return SessionStartResult.SUCCESS;
  }

  async postNextQuestion(sessionId: number, chatId: number): Promise<boolean> {
    const nextQuestion = await this.userQuizSessionQuestionRepository.findNextUnansweredQuestion(sessionId);
    if (!nextQuestion) {
      this.logger.debug(`No more questions for session ${sessionId}`);
      return false;
    }

    const question = await this.quizQuestionRepository.findById(nextQuestion.questionId);
    if (!question) {
      this.logger.error(`Question ${nextQuestion.questionId} not found`);
      return false;
    }

    const image = question.image ? Buffer.from(question.image) : undefined;
    const answers = JSON.parse(question.answers) as string[];

    const response = await this.telegrafService.sendQuizToChatId(
      chatId,
      question.question,
      answers,
      question.correctAnswerIndex,
      image,
    );

    if (!response || !response.poll || !response.poll.id) {
      this.logger.error('Could not create a poll for session question');
      return false;
    }

    const pollId = BigInt(response.poll.id);

    const postedQuestion = await this.postedQuestionRepository.createData({
      telegramChatId: chatId,
      telegramMsgId: pollId,
      question: { connect: { id: question.id } },
      answerMode: AnswerMode.MULTIPLE_CHOICE,
    });

    await this.userQuizSessionQuestionRepository.update({
      where: { id: nextQuestion.id },
      data: { postedQuestion: { connect: { id: postedQuestion.id } } },
    });

    this.logger.debug(`Posted question ${question.id} for session ${sessionId}`);
    return true;
  }

  private async selectRandomQuestions(count: number): Promise<QuizQuestion[]> {
    const allQuestions = await this.quizQuestionRepository.delegate.findMany({});
    const shuffled = shuffleArray(allQuestions);
    return shuffled.slice(0, count);
  }
}
