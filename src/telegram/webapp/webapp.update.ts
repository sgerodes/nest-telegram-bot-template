import { Ctx, On, Update } from 'nestjs-telegraf';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { WizardI18nContext } from '@telegram/utils';
import { AdminOnly } from '@telegram/utils';

type WebAppPayload = {
  type: 'webapp_message';
  message: string;
};

@Update()
export class WebAppUpdate extends BaseTelegramHandler {
  @On('message')
  @AdminOnly()
  async onWebAppData(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`Received message from webapp: ${ctx.message}`);
    const raw = (ctx.message as any)?.web_app_data?.data;
    if (!raw) {
      return;
    }
    let payload: WebAppPayload | null = null;
    try {
      payload = JSON.parse(raw) as WebAppPayload;
    } catch {
      await ctx.reply(`WebApp data: ${raw}`);
      return;
    }
    if (payload?.type === 'webapp_message' && payload.message) {
      await ctx.reply(`WebApp says: ${payload.message}`);
      return;
    }
    await ctx.reply(`WebApp data: ${raw}`);
  }
}
