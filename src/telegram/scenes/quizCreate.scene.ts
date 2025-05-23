import { BOT_ADMIN_CHAT_COMMANDS, SCENES, TELEGRAM_BTN_ACTIONS } from '@configuration/telegramConstants';
import { i18nKeys } from '@i18n/i18n.keys';
import { Action, Ctx, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardI18nContext } from '@telegram/utils';
import { InlineKeyboardButton } from '@telegraf/types';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { Message } from 'telegraf/typings/core/types/typegram';
import { PrismaService } from '@database/prisma.service';
import { QuizQuestion } from '@prisma/client';
import { TelegrafService } from '@telegram/telegraf.service';

@Wizard(SCENES.SCENE_QUIZ_CREATE)
export class SceneQuizManager extends BaseTelegramHandler {

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegrafService: TelegrafService,
  ) {
    super();
  }

  // @SceneEnter()
  @WizardStep(0)
  async onEnter(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`Entering SceneQuizManager step 0`);
    await ctx.tReply(i18nKeys.i18n.command.quizAdmin.scene
      .create_quiz_question_message_example)
  }

}
