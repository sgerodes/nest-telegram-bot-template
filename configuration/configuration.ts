import * as process from 'node:process';
import { getAbsolutePathForProjectDirectory } from '@configuration/configUtils';
import {RootConfig} from "@configuration/configurationSchema";


export const configuration = (): RootConfig => ({
  application: {
    port: Number(process.env.PORT) || 3080,
  },
  telegram: {
    bot: {
      token: process.env.TELEGRAM_BOT_TOKEN,
    },
    i18n: {
      fallbackLanguage: 'en',
      i18nFolderPath: getAbsolutePathForProjectDirectory('configuration/i18n/'),
    },
  },
});
