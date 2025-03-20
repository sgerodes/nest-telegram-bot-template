import { Test, TestingModule } from '@nestjs/testing';
import { I18nKeysValidationServiceService } from './i18n-keys-validation-service.service';

describe('I18nKeysValidationServiceService', () => {
  let service: I18nKeysValidationServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [I18nKeysValidationServiceService],
    }).compile();

    service = module.get<I18nKeysValidationServiceService>(I18nKeysValidationServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
