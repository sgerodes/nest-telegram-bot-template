import { SCENES } from '@configuration/telegramConstants';
import { i18nKeys } from '@i18n/i18n.keys';
import {Ctx, SceneEnter, Wizard, WizardStep} from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { WizardI18nContext } from '@telegram/utils';

@Wizard(SCENES.SCENE_HELLO)
export class SceneHello {
  private readonly logger = new Logger(this.constructor.name);

  // @WizardStep(1)
  @SceneEnter()
  async step1(@Ctx() ctx: WizardI18nContext) {
    await ctx.reply(ctx.t(i18nKeys.i18n.command.hello.scene.first_message));
    ctx.wizard.next();
  }

  @WizardStep(1)
  async step2(@Ctx() ctx: WizardI18nContext) {
    await ctx.reply(ctx.t(i18nKeys.i18n.command.hello.scene.second_message));
    await ctx.scene.leave();
  }
}
