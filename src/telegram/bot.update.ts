import { Context as TelegrafContext } from 'telegraf';
import {
  Action,
  Command,
  // Context as NestjsTelegrafContext,
  Ctx,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import {
  BOT_COMMANDS,
  SCENES,
  TELEGRAM_BTN_ACTIONS,
} from '@configuration/telegramConstants';
import { InlineKeyboardButton } from '@telegraf/types';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { i18nKeys } from '@i18n/i18n.keys';
import { TelegrafService } from '@telegram/telegraf.service';
import {AdminOnly, WizardI18nContext} from "@telegram/utils";

@Update()
export class BotUpdate {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly userRepositoryService: UserRepositoryService,
    private readonly telegramConfig: TelegramConfig,
    private readonly telegrafService: TelegrafService,
  ) {
    if (this.telegramConfig.bot.updateMetadata) {
      telegrafService.updateMetadata(); // TODO update on metadata change and respect the time to update the metadata
    }
  }

  @Start()
  @AdminOnly()
  async startCommand(@Ctx() ctx: WizardI18nContext) {
    if (!(await this.userRepositoryService.existsByTelegramId(ctx.from.id))) {
      const _user = await this.userRepositoryService.createData({
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        telegramFirstName: ctx.from.first_name,
      });
    }
    const message = ctx.t(i18nKeys.i18n.menus.start.message);
    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.t(i18nKeys.i18n.menus.start.buttons.welcome_button),
          url: 'https://t.me/addlist/v_Xq-yXm0yFjY2Ji',
        },
      ],
      [this.getDeleteButton(ctx)],
    ];

    await ctx.reply(message, {
      reply_markup: { inline_keyboard: buttons },
    });
  }

  @Command(BOT_COMMANDS.QUIZ)
  async quizCommand(@Ctx() ctx: WizardI18nContext) {
    await this.telegrafService.sendQuizToChatId(
      this.telegramConfig.telegramIds.playgroundChannelId,
      'Who is the best?',
      ['Me', 'You', 'All'],
      2,
      true,
    );
    await this.telegrafService.sendQuizToChatId(
      this.telegramConfig.telegramIds.playgroundGroupId,
      'Who is the best?',
      ['Me', 'You', 'All'],
      0,
      false,
    );
  }

  @Command(BOT_COMMANDS.HELLO)
  async helloCommand(@Ctx() ctx: WizardI18nContext) {
    const message = ctx.t(i18nKeys.i18n.menus.hello.message);
    await ctx.reply(message);
    await ctx.scene.enter(SCENES.SCENE_HELLO);
  }

  getDeleteButton(ctx: WizardI18nContext): InlineKeyboardButton {
    return {
      text: ctx.t(i18nKeys.i18n.shared.buttons.close),
      callback_data: TELEGRAM_BTN_ACTIONS.CLOSE,
    };
  }

  @Action(TELEGRAM_BTN_ACTIONS.CLOSE)
  async close(@Ctx() ctx: TelegrafContext) {
    await ctx.deleteMessage();
  }
}
