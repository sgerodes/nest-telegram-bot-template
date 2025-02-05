import * as process from 'node:process';
import { getAbsolutePathForProjectDirectory } from '@configuration/configUtils';
import { RootConfig } from '@configuration/configuration.models';

export const configuration = (): RootConfig => ({
  application: {
    port: Number(process.env.PORT) || 3000,
  },
  telegram: {
    bot: {
      token: process.env.TELEGRAM_BOT_TOKEN,
      updateMetadata: process.env.UPDATE_METADATA
        ? process.env.UPDATE_METADATA.toLowerCase() === 'true'
        : true,
    },
    i18n: {
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'fr-*': 'fr',
        'pt-*': 'pt',
      },
      logging: false,
      i18nFolderPath: getAbsolutePathForProjectDirectory('configuration/i18n/'),
      typesOutputPath: getAbsolutePathForProjectDirectory('configuration/i18n/') + 'i18n.generated.ts',
      enabledLanguages: ['en'],
    },
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
