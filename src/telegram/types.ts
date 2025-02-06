import { Scenes } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';

export type WizardI18nContext = Scenes.WizardContext &
  TelegrafI18nContext<I18nTranslations>;
