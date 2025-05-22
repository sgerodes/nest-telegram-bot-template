import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SessionQuizService } from './session-quiz/session-quiz.service';
import { ScheduledQuizService } from './scheduled-quiz/scheduled-quiz.service';

@Module({
  providers: [QuizService, SessionQuizService, ScheduledQuizService],
  exports: [QuizService],
})
export class QuizModule {}
