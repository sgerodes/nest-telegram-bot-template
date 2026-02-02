import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { UserQuizSessionQuestion } from '@prisma/client';

@Injectable()
export class UserQuizSessionQuestionRepository extends AbstractRepositoryV3<UserQuizSessionQuestion> {
  async findNextUnansweredQuestion(sessionId: number): Promise<UserQuizSessionQuestion | null> {
    return this.findFirst({
      where: {
        sessionId,
        postedQuestionId: null,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }
}
