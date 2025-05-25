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
      playgroundSuperGroupId: -1001864900132,
      quizGroupId: -1001864900132,
      ownerTelegramId: 41459859, //sg
      adminGroupId: -4948426032,
      adminTelegramIds: [219327518, 399103080, 49576483, 7304566667],
      // Chat ID: -4948426032, Chat Name 'Playground Admin Group'
      // Chat ID: -1001864900132, Chat Name 'Playground Private Group'
    },
  },
  quiz: {
    quizQuestionDirectory: getAbsolutePathForProjectDirectory('resources/quiz/'),
    dailyScheduledQuizPostTime: '13:17',
    maxQuestionLength: 255,
    maxAnswerLength: 100,
    openPeriodDurationSeconds: 60 * 60 * 24, // a day
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  ton: {
    paymentAddress: process.env.TON_PAYMENT_ADDRESS,
  },
});
