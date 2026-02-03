import { Command, Ctx, Update } from 'nestjs-telegraf';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { BOT_ADMIN_CHAT_COMMANDS, SCENES } from '@configuration/telegramConstants';

@Update()
export class QuizUpdate extends BaseTelegramHandler {
  @Command(BOT_ADMIN_CHAT_COMMANDS.CREATE_QUESTION)
  @AdminOnly()
  async createQuestionCommand(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`${BOT_ADMIN_CHAT_COMMANDS.CREATE_QUESTION} command received`);
    await ctx.scene.enter(SCENES.SCENE_QUESTION_CREATE);
  }
}
