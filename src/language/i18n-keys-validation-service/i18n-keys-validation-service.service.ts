import { Injectable, Logger } from '@nestjs/common';
import { I18nOptions, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';
import * as path from 'path';
import * as fs from 'fs';
import { combinedKeys, extractJsonKeys, listFilesInFolder, readJson, readLangKeys } from '@i18n/i18nUtils';

@Injectable()
export class I18nKeysValidationServiceService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly i18n: I18nService<I18nTranslations>
  ) {
    this.validateKeys()
  }


  private validateKeys() {
    const ignoreLanguages = ['pt'];
    // const checkLanguages = ['en', 'ru'];

    let supportedLanguages = this.i18n.getSupportedLanguages();
    const i18nOptions: I18nOptions = (this.i18n as any)['i18nOptions'];
    const i18nPath: string = i18nOptions.loaderOptions?.path;

    const languagesToCheck: string[] = supportedLanguages.filter(lang => !ignoreLanguages.includes(lang));

    const langKeys = readLangKeys(i18nPath, languagesToCheck);
    const allKeys = combinedKeys(langKeys);

    for (const key of allKeys) {
      const missing: string[] = [];
      const existent: string[] = [];
      for (const lang in langKeys) {
        const jjj = langKeys[lang];
        if (langKeys[lang].has(key)) {
          existent.push(lang);
        } else {
          missing.push(lang);
        }
      }
      if (missing.length > 0) {
        this.logger.debug(`Existent in ${existent}; missing in ${missing}; i18n key '${key}':`);
      }
    }
  }

}
