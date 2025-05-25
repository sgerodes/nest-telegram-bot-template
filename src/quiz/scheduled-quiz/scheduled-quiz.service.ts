import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { TelegrafService } from '@telegram/telegraf.service';
import { TelegramConfig, QuizConfig } from '@configuration/validation/configuration.validators';
import { ScheduledQuizRepositoryService } from '@database/quiz-repository/schedule-quiz-question-repository.service';
import { CronJob } from 'cron';
import { QuizQuestion, ScheduledQuiz } from '@prisma/client';
import { PostedQuestionRepositoryService } from '@database/quiz-repository/posted-question-repository.service';

@Injectable()
export class ScheduledQuizService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly telegrafService: TelegrafService,
    private readonly quizConfig: QuizConfig,
    private readonly telegramConfig: TelegramConfig,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly scheduledQuizRepositoryService: ScheduledQuizRepositoryService,
    private readonly postedQuestionRepositoryService: PostedQuestionRepositoryService
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
      let scheduledForToday: (ScheduledQuiz & { question: QuizQuestion })[] = await this.scheduledQuizRepositoryService.readScheduledForToday();
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

    const pollIdInt = BigInt(response.poll.id)

    const postedQuestionResponse = await this.postedQuestionRepositoryService.createData({
      telegramChatId: this.telegramConfig.telegramIds.quizGroupId,
      telegramMsgId: pollIdInt,
      question: { connect: { id: firstQuestion.id } },
    })
    if (!postedQuestionResponse) {
      this.logger.error("Could not write the postedQuestion to the db");
      return;
    }

  }

  // @Cron('* * * * *') // every minute
  // async checkAndPostScheduledQuizzes() {
  //
  // }


}