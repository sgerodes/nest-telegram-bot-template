import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SessionQuizService } from './session-quiz/session-quiz.service';
import { ScheduledQuizService } from './scheduled-quiz/scheduled-quiz.service';
import { TelegramModule } from '@telegram/telegram.module';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [TelegramModule, DatabaseModule],
  providers: [QuizService, SessionQuizService, ScheduledQuizService],
  exports: [QuizService],
})
export class QuizModule {}
