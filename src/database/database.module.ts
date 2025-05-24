import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { PrismaService } from '@database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuizQuestionRepositoryService } from '@database/quiz-repository/quiz-question-repository.service';
import {
  ScheduledQuizRepositoryService
} from '@database/quiz-repository/schedule-quiz-question-repository.service';
import { PostedQuestionRepositoryService } from '@database/quiz-repository/posted-question-repository.service';
import { UserAnswerRepositoryService } from '@database/quiz-repository/user-answer-repository.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService, UserRepositoryService, QuizQuestionRepositoryService, ScheduledQuizRepositoryService, PostedQuestionRepositoryService, UserAnswerRepositoryService],
  exports: [PrismaService, UserRepositoryService, QuizQuestionRepositoryService, ScheduledQuizRepositoryService, PostedQuestionRepositoryService, UserAnswerRepositoryService],
})
export class DatabaseModule {}
