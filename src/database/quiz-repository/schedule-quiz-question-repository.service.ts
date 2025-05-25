import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstract.repository';
import { Prisma, QuizQuestion, ScheduledQuiz } from '@prisma/client';

@Injectable()
export class ScheduledQuizRepositoryService extends AbstractRepository<
  ScheduledQuiz,
  Prisma.ScheduledQuizDelegate,
  Prisma.ScheduledQuizCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.scheduledQuiz);
  }

  async readScheduledForToday(): Promise<(ScheduledQuiz & { question: QuizQuestion })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.readScheduledBetweenDates(today, tomorrow);
  }

  async readScheduledForYesterday(): Promise<(ScheduledQuiz & { question: QuizQuestion })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return this.readScheduledBetweenDates(yesterday, today);
  }

  async readScheduledBetweenDates(gte: Date, lt: Date): Promise<(ScheduledQuiz & { question: QuizQuestion })[]> {
    return this.modelDelegate.findMany({
      where: {
        scheduledAt: {
          gte: gte,
          lt: lt,
        },
        postedQuestionId: null,
      },
      include: {
        question: true,
      },
    });
  }
}
