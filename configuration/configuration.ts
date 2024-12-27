import * as Joi from 'joi';
import * as process from 'node:process';
import { getAbsolutePathForProjectDirectory } from './configUtils';

export enum BotCommands {
  START = 'start',
}

export default () => {
  return {
    countriesFlagsFolderPath: getAbsolutePathForProjectDirectory(
      '/resources/world_countries/data/flags/',
    ),
    telegram: {
      bot: {
        token: process.env.TELEGRAM_BOT_TOKEN,
        commands: BotCommands
      },
      i18n: {
        fallbackLanguage: 'en',
        i18nFolderPath: getAbsolutePathForProjectDirectory('configuration/i18n/'),
      },
    },
  };
};

export const configurationValidationSchema = Joi.object({
  TELEGRAM_BOT_TOKEN: Joi.string().required(),
});
