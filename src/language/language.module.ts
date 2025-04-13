import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { I18nKeysValidationServiceService } from './i18n-keys-validation-service/i18n-keys-validation-service.service';

@Module({
  imports: [],
  providers: [LanguageService,
    // I18nKeysValidationServiceService
  ],
  exports: [LanguageService],
})
export class LanguageModule {}
