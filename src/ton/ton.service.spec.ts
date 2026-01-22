import { Test, TestingModule } from '@nestjs/testing';
import { TonService } from './ton.service';
import { TonConfig } from '@configuration/validation/configuration.validators';

describe('TonService', () => {
  let service: TonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TonService,
        {
          provide: TonConfig,
          useValue: {
            paymentAddress: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
            endpoint: 'https://toncenter.com/api/v2/jsonRPC',
            apiKey: 'test-key',
            timeoutMs: 5000,
          },
        },
      ],
    }).compile();

    service = module.get<TonService>(TonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
