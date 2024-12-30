import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';

@Module({
  imports: [],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
