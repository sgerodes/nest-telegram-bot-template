import { RestrictToTelegramIds } from '@telegram/decorators';
import { configuration } from '@configuration/configuration'; // Import the function
import { Scenes } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';
import { applyDecorators } from '@nestjs/common';
import { ITelegrafI18nContext } from '@telegram/interfaces';

// export type WizardI18nContext = Scenes.WizardContext &
//     TelegrafI18nContext<I18nTranslations>;
export type WizardI18nContext = Scenes.WizardContext &
  ITelegrafI18nContext<I18nTranslations>;

/**
 * Generic function to create role-based decorators.
 */
function RestrictToIds(getIds: (config: any) => Set<number>) {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const config = configuration();
    if (!config?.telegram?.telegramIds) {
      throw new Error('Telegram configuration is missing or invalid');
    }
    const allowedIds = getIds(config); // Get the specific role-based IDs
    applyDecorators(RestrictToTelegramIds(allowedIds))(target, key, descriptor);
    return descriptor;
  };
}

/**
 * Allows access to both admins and the owner.
 */
export function AdminOnly() {
  return RestrictToIds(
    (config) =>
      new Set<number>([
        ...config.telegram.telegramIds.adminTelegramIds,
        config.telegram.telegramIds.ownerTelegramId,
      ]),
  );
}

/**
 * Allows access only to the owner.
 */
export function OwnerOnly() {
  return RestrictToIds(
    (config) => new Set<number>([config.telegram.telegramIds.ownerTelegramId]),
  );
}

export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() })) // Assign random sort key
    .sort((a, b) => a.sort - b.sort) // Sort based on the key
    .map(({ value }) => value); // Extract values
}