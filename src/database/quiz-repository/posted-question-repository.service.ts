import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstract.repository';
import { Prisma, PostedQuestion, QuizQuestion } from '@prisma/client';

@Injectable()
export class PostedQuestionRepositoryService extends AbstractRepository<
  PostedQuestion,
  Prisma.PostedQuestionDelegate,
  Prisma.PostedQuestionCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.postedQuestion);
  }

  async readByTelegramMsgIdIncludeQuestion(id: bigint | number): Promise<PostedQuestion & { question: QuizQuestion } | null> {
    return this.prisma.postedQuestion.findUnique({
      where: { telegramMsgId: id },
      include: { question: true },
    });
  }
}
