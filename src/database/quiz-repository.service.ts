import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstractRepository';
import { Prisma, QuizQuestion } from '@prisma/client';

@Injectable()
export class QuizRepositoryService extends AbstractRepository<
  QuizQuestion,
  Prisma.QuizQuestionDelegate,
  Prisma.QuizQuestionCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.quizQuestion);
  }

}