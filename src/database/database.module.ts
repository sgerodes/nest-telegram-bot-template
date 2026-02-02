import { Module } from '@nestjs/common';
import { TelegramUserRepository } from './user-repository/telegram-user.repository';
import { PrismaService } from '@database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuizQuestionRepository } from '@database/quiz-repository/quiz-question.repository';
import {
  ScheduledQuizRepository
} from '@database/quiz-repository/scheduled-quiz.repository';
import { PostedQuestionRepository } from '@database/quiz-repository/posted-question.repository';
import { UserAnswerRepository } from '@database/quiz-repository/user-answer.repository';
import { UserQuizSessionRepository } from '@database/quiz-repository/user-quiz-session.repository';
import { UserQuizSessionQuestionRepository } from '@database/quiz-repository/user-quiz-session-question.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    PrismaService,
    TelegramUserRepository,
    QuizQuestionRepository,
    ScheduledQuizRepository,
    PostedQuestionRepository,
    UserAnswerRepository,
    UserQuizSessionRepository,
    UserQuizSessionQuestionRepository,
  ],
  exports: [
    PrismaService,
    TelegramUserRepository,
    QuizQuestionRepository,
    ScheduledQuizRepository,
    PostedQuestionRepository,
    UserAnswerRepository,
    UserQuizSessionRepository,
    UserQuizSessionQuestionRepository,
  ],
})
export class DatabaseModule {}
