import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { TelegramUser, UserAnswer } from '@prisma/client';

@Injectable()
export class UserAnswerRepository extends AbstractRepositoryV3<UserAnswer> {
  async getCorrectUsersForPostedQuestion(postedQuestionId: number): Promise<(UserAnswer & { user: TelegramUser })[]> {
    return await this.delegate.findMany({
      where: {
        postedQuestionId,
        isCorrect: true,
      },
      include: {
        user: true,
      },
    }) as (UserAnswer & { user: TelegramUser })[];
  }
}
