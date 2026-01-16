import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { TelegramUserRepositoryV3Service } from './user-repository/user-repository.v3.service';
import { PrismaService } from '@database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuizQuestionRepositoryService } from '@database/quiz-repository/quiz-question-repository.service';
import { QuizQuestionRepositoryV3Service } from '@database/quiz-repository/quiz-question-repository.v3.service';
import {
  ScheduledQuizRepositoryService
} from '@database/quiz-repository/schedule-quiz-question-repository.service';
import {
  ScheduledQuizRepositoryV3Service
} from '@database/quiz-repository/schedule-quiz-question-repository.v3.service';
import { PostedQuestionRepositoryService } from '@database/quiz-repository/posted-question-repository.service';
import { PostedQuestionRepositoryV3Service } from '@database/quiz-repository/posted-question-repository.v3.service';
import { UserAnswerRepositoryService } from '@database/quiz-repository/user-answer-repository.service';
import { UserAnswerRepositoryV3Service } from '@database/quiz-repository/user-answer-repository.v3.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    PrismaService,
    UserRepositoryService,
    TelegramUserRepositoryV3Service,
    QuizQuestionRepositoryService,
    QuizQuestionRepositoryV3Service,
    ScheduledQuizRepositoryService,
    ScheduledQuizRepositoryV3Service,
    PostedQuestionRepositoryService,
    PostedQuestionRepositoryV3Service,
    UserAnswerRepositoryService,
    UserAnswerRepositoryV3Service,
  ],
  exports: [
    PrismaService,
    UserRepositoryService,
    TelegramUserRepositoryV3Service,
    QuizQuestionRepositoryService,
    QuizQuestionRepositoryV3Service,
    ScheduledQuizRepositoryService,
    ScheduledQuizRepositoryV3Service,
    PostedQuestionRepositoryService,
    PostedQuestionRepositoryV3Service,
    UserAnswerRepositoryService,
    UserAnswerRepositoryV3Service,
  ],
})
export class DatabaseModule {}
