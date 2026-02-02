import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { PostedQuestion, QuizQuestion } from '@prisma/client';

@Injectable()
export class PostedQuestionRepository extends AbstractRepositoryV3<PostedQuestion> {
  async findByTelegramMsgIdWithQuestion(id: bigint | number): Promise<(PostedQuestion & { question: QuizQuestion }) | null> {
    return await this.delegate.findUnique({
      where: { telegramMsgId: id },
      include: { question: true },
    }) as (PostedQuestion & { question: QuizQuestion }) | null;
  }
}
