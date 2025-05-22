import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { PrismaService } from '@database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuizQuestionRepositoryService } from '@database/quiz-repository/quiz-question-repository.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService, UserRepositoryService, QuizQuestionRepositoryService],
  exports: [PrismaService],
})
export class DatabaseModule {}
