/**
 * WebApp Integration Example
 *
 * This file shows how to wire up the webapp module into the application.
 * The webapp code exists in src/telegram/webapp/ but is not active by default.
 */

// ============================================
// 1. app.module.ts - Add CloudStorageWebAppModule
// ============================================

/*
import { CloudStorageWebAppModule } from '@telegram/webapp/cloud-storage-webapp.module';

@Module({
  imports: [
    // ... other imports
    CloudStorageWebAppModule,
  ],
})
export class AppModule {}
*/

// ============================================
// 2. telegram.module.ts - Add WebAppUpdate
// ============================================

/*
import { WebAppUpdate } from '@telegram/webapp/webapp.update';

@Module({
  // ...
  providers: [
    // ... other providers
    WebAppUpdate,
  ],
})
export class TelegramModule {}
*/

// ============================================
// 3. bot.admin.update.ts - Add cloudStorageWebApp command
// ============================================

/*
import { Command, Ctx, Help, Start, Update } from 'nestjs-telegraf';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { i18nKeys } from '@i18n/i18n.keys';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { BOT_ADMIN_CHAT_COMMANDS } from '@configuration/telegramConstants';

@Update()
export class BotAdminUpdate extends BaseTelegramHandler {
  constructor(private readonly telegramConfig: TelegramConfig) {
    super();
  }

  @Command(BOT_ADMIN_CHAT_COMMANDS.CLOUD_STORAGE_WEBAPP)
  @AdminOnly()
  async cloudStorageWebApp(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`${BOT_ADMIN_CHAT_COMMANDS.CLOUD_STORAGE_WEBAPP} command received`);
    const baseUrl = this.telegramConfig.webApp?.url;
    if (!baseUrl) {
      await ctx.tReply(i18nKeys.i18n.errors.webapp_not_configured);
      return;
    }
    let url: string;
    try {
      url = new URL('/webapp/cloud-storage', baseUrl).toString();
    } catch (error) {
      this.logger.error(`Invalid TELEGRAM_WEBAPP_URL: ${baseUrl}`, error?.stack);
      await ctx.tReply(i18nKeys.i18n.errors.webapp_invalid);
      return;
    }
    await ctx.reply(ctx.t(i18nKeys.i18n.webapp.open_cloud_storage), {
      reply_markup: {
        keyboard: [[{ text: ctx.t(i18nKeys.i18n.webapp.open_button), web_app: { url } }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }
}
*/

// ============================================
// 4. Environment Variables Required
// ============================================

/*
TELEGRAM_WEBAPP_URL=https://your-public-url.com
*/
