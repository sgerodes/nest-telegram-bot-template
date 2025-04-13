import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { PrismaService } from '@database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { QuizRepositoryService } from '@database/quiz-repository.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService, UserRepositoryService, QuizRepositoryService],
  exports: [PrismaService],
})
export class DatabaseModule {}
