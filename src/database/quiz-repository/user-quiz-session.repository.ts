import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { UserQuizSession } from '@prisma/client';

@Injectable()
export class UserQuizSessionRepository extends AbstractRepositoryV3<UserQuizSession> {
  async findActiveSessionByUserId(userId: number): Promise<UserQuizSession | null> {
    return this.findFirst({
      where: {
        userId,
        completedAt: null,
      },
    });
  }
}
