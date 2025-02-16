import { RestrictToTelegramIds } from '@telegram/decorators';
import { configuration } from '@configuration/configuration'; // Import the function
import { Scenes } from 'telegraf';
import { TelegrafI18nContext } from 'nestjs-telegraf-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';
import {applyDecorators} from "@nestjs/common";

export type WizardI18nContext = Scenes.WizardContext &
    TelegrafI18nContext<I18nTranslations>;

export function AdminOnly() {
    return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
        const config = configuration();

        if (!config?.telegram?.telegramIds) {
            throw new Error('Telegram configuration is missing or invalid');
        }

        const adminIds = new Set<number>([
            ...config.telegram.telegramIds.adminTelegramIds,
            config.telegram.telegramIds.ownerTelegramId,
        ]);

        applyDecorators(RestrictToTelegramIds(adminIds))(target, key, descriptor);

        return descriptor;
    };
}