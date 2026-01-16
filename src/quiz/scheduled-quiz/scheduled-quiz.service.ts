import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TelegrafService } from '@telegram/telegraf.service';
import { TelegramConfig, QuizConfig } from '@configuration/validation/configuration.validators';
import { ScheduledQuizRepository } from '@database/quiz-repository/scheduled-quiz.repository';
import { CronJob } from 'cron';
import { QuizQuestion, ScheduledQuiz } from '@prisma/client';
import { PostedQuestionRepository } from '@database/quiz-repository/posted-question.repository';

@Injectable()
export class ScheduledQuizService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly telegrafService: TelegrafService,
    private readonly quizConfig: QuizConfig,
    private readonly telegramConfig: TelegramConfig,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly scheduledQuizRepository: ScheduledQuizRepository,
    private readonly postedQuestionRepository: PostedQuestionRepository
  ) {}


  onModuleInit() {
    const [hours, minutes] = this.quizConfig.dailyScheduledQuizPostTime
      .split(':')
      .map((v) => Number(v));

    const cronExpression = `${minutes} ${hours} * * *`; // "MM HH * * *"

    const job = new CronJob(cronExpression, () => this.executeScheduledQuizJob());

    this.schedulerRegistry.addCronJob('daily-quiz-post', job);
    job.start();

    this.logger.log(`Scheduled daily quiz post at ${cronExpression}`);
  }


  private async executeScheduledQuizJob() {
      let scheduledForToday: (ScheduledQuiz & { question: QuizQuestion })[] = await this.scheduledQuizRepository.readScheduledForToday();
      if (!scheduledForToday || scheduledForToday.length == 0) {
        this.logger.debug(`No scheduled quizzes for today: ${scheduledForToday}`);
        return;
      }
    const firstScheduledQuiz = scheduledForToday[0];
    const firstQuestion: QuizQuestion = firstScheduledQuiz.question;
    const image = firstQuestion.image ? Buffer.from(firstQuestion.image) : undefined;

    const response = await this.telegrafService.sendQuizToChatId(
      this.telegramConfig.telegramIds.quizGroupId,
      firstQuestion.question,
      JSON.parse(firstQuestion.answers),
      firstQuestion.correctAnswerIndex,
      image,
    )

    if (!response || !response.poll || !response.poll.id) {
      this.logger.error("Could not create a poll");
      return;
    }

    const pollId = BigInt(response.poll.id)

    const postedQuestionResponse = await this.postedQuestionRepository.createData({
      telegramChatId: this.telegramConfig.telegramIds.quizGroupId,
      telegramMsgId: pollId,
      question: { connect: { id: firstQuestion.id } },
    })
    if (!postedQuestionResponse) {
      this.logger.error("Could not write the postedQuestion to the db");
      return;
    }

    await this.telegrafService.pinMessage(
      this.telegramConfig.telegramIds.quizGroupId,
      response.message_id
    )

  }

  // @Cron('* * * * *') // every minute
  // async checkAndPostScheduledQuizzes() {
  //
  // }


}
