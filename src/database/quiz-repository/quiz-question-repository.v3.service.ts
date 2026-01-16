import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { Prisma, QuizQuestion } from '@prisma/client';

@Injectable()
export class QuizQuestionRepositoryV3Service extends AbstractRepositoryV3<QuizQuestion> {
  async createData(obj: Prisma.QuizQuestionCreateInput): Promise<QuizQuestion> {
    if (!(await this.isValidQuizQuestion(obj))) {
      this.logger.error(`Quiz record validation error: ${JSON.stringify(obj)}`);
      throw new Error('Invalid quiz question input');
    }
    return await super.createData(obj);
  }

  async isValidQuizQuestion(obj: Prisma.QuizQuestionCreateInput): Promise<boolean> {
    const correctIndex = obj.correctAnswerIndex;

    let answers: unknown;
    try {
      answers = typeof obj.answers === 'string' ? JSON.parse(obj.answers) : obj.answers;
    } catch {
      return false;
    }

    if (!Array.isArray(answers)) return false;
    if (!answers.every(ans => typeof ans === 'string')) return false;
    if (correctIndex < 0 || correctIndex >= answers.length) return false;

    return true;
  }
}
