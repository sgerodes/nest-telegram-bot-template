import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstract.repository';
import { Prisma, QuizQuestion } from '@prisma/client';

@Injectable()
export class QuizQuestionRepositoryService extends AbstractRepository<
  QuizQuestion,
  Prisma.QuizQuestionDelegate,
  Prisma.QuizQuestionCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.quizQuestion);
  }

  async createData(obj: Prisma.QuizQuestionCreateInput): Promise<QuizQuestion> {
    if (!(await this.isValidQuizQuestion(obj))) {
      this.logger.error(`Quiz record validation error: ${obj}`);
      throw new Error('Invalid quiz question input');
    }
    return await super.createData(obj);
  }

  async isValidQuizQuestion(obj: Prisma.QuizQuestionCreateInput): Promise<boolean> {
    const correctIndex = obj.correctAnswerIndex;

    let answers: unknown;
    try {
      answers = JSON.parse(obj.answers);
    } catch {
      return false;
    }

    if (!Array.isArray(answers)) return false;
    if (!answers.every(ans => typeof ans === 'string')) return false;
    if (correctIndex < 0 || correctIndex >= answers.length) return false;

    return true;
  }

}