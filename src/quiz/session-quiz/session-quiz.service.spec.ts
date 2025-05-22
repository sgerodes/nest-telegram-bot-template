import { Test, TestingModule } from '@nestjs/testing';
import { SessionQuizService } from './session-quiz.service';

describe('SessionQuizService', () => {
  let service: SessionQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionQuizService],
    }).compile();

    service = module.get<SessionQuizService>(SessionQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
