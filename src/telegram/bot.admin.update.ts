import { Context as TelegrafContext } from 'telegraf';
import {
  Action,
  Command,
  // Context as NestjsTelegrafContext,
  Ctx,
  Hears,
  Help,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { i18nKeys } from '@i18n/i18n.keys';
import { TelegrafService } from '@telegram/telegraf.service';
import { AdminOnly, WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { BOT_ADMIN_CHAT_COMMANDS, SCENES } from '@configuration/telegramConstants';

@Update()
export class BotAdminUpdate extends BaseTelegramHandler {

  constructor(
    private readonly telegramConfig: TelegramConfig,
    private readonly telegrafService: TelegrafService,
  ) {
    super();
  }

  @Start()
  @AdminOnly()
  async startCommand(@Ctx() ctx: WizardI18nContext) {
    await ctx.reply(ctx.t(i18nKeys.i18n.command.start.message));
  }

  @Help()
  @AdminOnly()
  async help(@Ctx() ctx: WizardI18nContext) {
    await ctx.tReply(i18nKeys.i18n.command.help.message);
  }

  @Command(BOT_ADMIN_CHAT_COMMANDS.CREATE_QUESTION)
  @AdminOnly()
  async quizManagerCommand(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`${BOT_ADMIN_CHAT_COMMANDS.CREATE_QUESTION} command received`);
    await ctx.scene.enter(SCENES.SCENE_QUESTION_CREATE);
  }
}
