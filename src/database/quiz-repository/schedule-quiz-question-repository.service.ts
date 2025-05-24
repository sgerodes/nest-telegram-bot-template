import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstract.repository';
import { Prisma, ScheduledQuiz } from '@prisma/client';

@Injectable()
export class ScheduledQuizRepositoryService extends AbstractRepository<
  ScheduledQuiz,
  Prisma.ScheduledQuizDelegate,
  Prisma.ScheduledQuizCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.scheduledQuiz);
  }
}
