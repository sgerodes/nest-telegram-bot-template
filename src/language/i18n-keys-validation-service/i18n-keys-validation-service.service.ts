import { Injectable, Logger } from '@nestjs/common';
import { I18nOptions, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';
import * as path from 'path';
import * as fs from 'fs';
import { extractJsonKeys, listFilesInFolder, readJson } from '@i18n/i18nUtils';

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

    const langKeys = this.readLangKeys(i18nPath, languagesToCheck);
    const allKeys = this.combinedKeys(langKeys);

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

  private combinedKeys(langKeys: object): Set<string> {
    let keys = new Set<string>();

    for (const lang in langKeys) {
      keys = this.addSets(keys, langKeys[lang]);
    }

    return keys;
  }

  private readLangKeys(i18nPath: string, languagesToCheck: string[]): object {
    const langKeys = {};

    for (const lang of languagesToCheck) {
      const langFolder = path.join(i18nPath, lang);
      const langFiles = listFilesInFolder(langFolder);
      let langKeysSet = new Set<string>();
      for (const f of langFiles) {
        const fullPath = path.join(i18nPath, lang, f);
        const jsonObject = readJson(fullPath);
        const keys = extractJsonKeys(jsonObject);
        langKeysSet = this.addSets(langKeysSet, this.prefixKeysWithFileName(f, keys));
      }
      langKeys[lang] = langKeysSet;
    }
    return langKeys;
  }

  private prefixKeysWithFileName(fileName: string, keys: Iterable<string>): Set<string> {
    fileName = path.basename(fileName);
    const prefix = fileName.replace('.json', '');
    const prefixedKeys = new Set<string>();
    for (const key of keys) {
      prefixedKeys.add(`${prefix}.${key}`);
    }
    return prefixedKeys;
  }

  private subtractSets(setA: Set<string>, setB: Set<string>): Set<string> {
    return new Set([...setA].filter(item => !setB.has(item)));
  }

  private addSets(setA: Set<string>, setB: Set<string>): Set<string> {
    return new Set([...setA, ...setB]);
  }
}
