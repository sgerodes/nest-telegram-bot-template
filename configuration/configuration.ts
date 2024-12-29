import * as process from 'node:process';
import { getAbsolutePathForProjectDirectory } from '@configuration/configUtils';
import {RootConfig} from "@configuration/validationAndInterfaces";


export const configuration = (): RootConfig => ({
  application: {
    port: Number(process.env.PORT) || 3069,
  },
  telegram: {
    bot: {
      token: process.env.TELEGRAM_BOT_TOKEN,
      displayName: "A very awesome bot",
      shortDescription: "Does awesome stuff",
      description: "Does a lot of awesome stuff",
    },
    i18n: {
      fallbackLanguage: 'en',
      i18nFolderPath: getAbsolutePathForProjectDirectory('configuration/i18n/'),
    },
  },
  database: {
    url: process.env.DATABASE_URL
  }
});
