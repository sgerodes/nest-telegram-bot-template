import * as Joi from 'joi';
import * as process from 'node:process';
import { getAbsolutePathForProjectDirectory } from './configUtils';
import {RootConfig} from "./configurationSchema";


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


export const configurationValidationSchema = Joi.object({
  PORT: Joi.number().integer().min(1).max(65535).optional(),
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
});
