import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '@database/prisma.service';
import { TelegrafService } from '@telegram/telegraf.service';
import { TelegramConfig, QuizConfig } from '@configuration/validation/configuration.validators';
import { ScheduledQuizRepositoryService } from '@database/quiz-repository/schedule-quiz-question-repository.service';
import { CronJob } from 'cron';

@Injectable()
export class ScheduledQuizService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly telegrafService: TelegrafService,
    private readonly quizConfig: QuizConfig,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly scheduledQuizRepositoryService: ScheduledQuizRepositoryService,
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
      let scheduledForToday = await this.scheduledQuizRepositoryService.readScheduledForToday();
  }

  // @Cron('* * * * *') // every minute
  // async checkAndPostScheduledQuizzes() {
  //
  // }


}