import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { PostedQuestion, QuizQuestion } from '@prisma/client';

@Injectable()
export class PostedQuestionRepositoryV3Service extends AbstractRepositoryV3<PostedQuestion> {
  async readByTelegramMsgIdIncludeQuestion(id: bigint | number): Promise<PostedQuestion & { question: QuizQuestion } | null> {
    return this.delegate.findUnique({
      where: { telegramMsgId: id },
      include: { question: true },
    });
  }
}
