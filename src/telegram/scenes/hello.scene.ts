import { SCENES } from '@configuration/telegramConstants';
import { i18nKeys } from '@i18n/i18n.keys';
import { Ctx, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { WizardI18nContext } from '@telegram/utils';
import { Scenes } from 'telegraf';
import { ITelegrafI18nContext } from '@telegram/interface';
import { I18nTranslations } from '@i18n/i18n.generated';

@Wizard(SCENES.SCENE_HELLO)
export class SceneHello {
  private readonly logger = new Logger(this.constructor.name);

  @SceneEnter()
  async onEnter(
    @Ctx() ctx: Scenes.WizardContext & ITelegrafI18nContext<I18nTranslations>,
  ) {
    const translated_message = ctx.translate(
      i18nKeys.i18n.command.hello.scene.first_message,
    );
    await ctx.reply(translated_message);
  }

  @WizardStep(1)
  async step1(
    @Ctx() ctx: Scenes.WizardContext & ITelegrafI18nContext<I18nTranslations>,
  ) {
    const translated_message = ctx.translate(
      i18nKeys.i18n.command.hello.scene.second_message,
    );
    await ctx.reply(translated_message);
    await ctx.scene.leave();
  }
}
