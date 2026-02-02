import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { QuizQuestion, ScheduledQuiz } from '@prisma/client';

@Injectable()
export class ScheduledQuizRepository extends AbstractRepositoryV3<ScheduledQuiz> {
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
    return await this.delegate.findMany({
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
    }) as (ScheduledQuiz & { question: QuizQuestion })[];
  }
}
