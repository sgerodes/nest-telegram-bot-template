import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledQuizService } from './scheduled-quiz.service';

describe('ScheduledQuizService', () => {
  let service: ScheduledQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledQuizService],
    }).compile();

    service = module.get<ScheduledQuizService>(ScheduledQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
