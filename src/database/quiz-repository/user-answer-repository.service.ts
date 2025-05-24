import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstract.repository';
import { Prisma, UserAnswer } from '@prisma/client';

@Injectable()
export class UserAnswerRepositoryService extends AbstractRepository<
  UserAnswer,
  Prisma.UserAnswerDelegate,
  Prisma.UserAnswerCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.userAnswer);
  }
}
