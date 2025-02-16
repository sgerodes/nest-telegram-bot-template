import * as process from 'node:process';
import { getAbsolutePathForProjectDirectory } from '@configuration/configUtils';
import { RootConfig } from '@configuration/validation/configuration.validators';

export const configuration = (): RootConfig => ({
  telegram: {
    bot: {
      token: process.env.TELEGRAM_BOT_TOKEN,
      updateMetadata: process.env.UPDATE_METADATA
        ? process.env.UPDATE_METADATA.toLowerCase() === 'true'
        : false,
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
    telegramIds: {
      playgroundChannelId: -1002377415957,
      playgroundGroupId: -1001864900132,
      // ownerTelegramId: 41459859, //sg
      ownerTelegramId: 334342, // test non existing

      adminTelegramIds: [], // others
    }
  },
  database: {
    url: process.env.DATABASE_URL,
  },
});
