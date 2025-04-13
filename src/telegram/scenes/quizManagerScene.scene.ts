import { SCENES, TELEGRAM_BTN_ACTIONS } from '@configuration/telegramConstants';
import { i18nKeys } from '@i18n/i18n.keys';
import { Action, Ctx, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardI18nContext } from '@telegram/utils';
import { InlineKeyboardButton } from '@telegraf/types';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { Message } from 'telegraf/typings/core/types/typegram';
import { PrismaService } from '@database/prisma.service';
import { QuizQuestion } from '@prisma/client';
import { TelegrafService } from '@telegram/telegraf.service';

@Wizard(SCENES.SCENE_QUIZ_MANAGER)
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
    this.logger.debug('Entering step 0 of quiz creation')
    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.t(
            i18nKeys.i18n.command.quizAdmin.buttons.enter_message_create,
          ),
          callback_data: TELEGRAM_BTN_ACTIONS.QUIZ_ADMIN_CREATE,
        },
      ],
      [this.getCloseButton(ctx)],
    ];

    await ctx.reply(
      ctx.t(i18nKeys.i18n.command.quizAdmin.scene.enter_message),
      {
        reply_markup: { inline_keyboard: buttons },
      },
    );
  }

  @WizardStep(1)
  async handleQuizQuestionInput(@Ctx() ctx: WizardI18nContext) {
    this.logger.log(`Entering step 1`);
    const message = ctx.message as Message.TextMessage;
    const photo = 'photo' in message ? message.photo?.[0]?.file_id : null;
    const text = 'text' in message ? message.text : null;

    if (!text) {
      this.logger.log(`No text provided: ${text}`);
      await ctx.reply(ctx.t(i18nKeys.i18n.command.quizAdmin.scene.error_no_quiz_provided));
      ctx.wizard.selectStep(1);
    }
    this.logger.log(`Question received ${text}. Will try to parse`);

    const lines = text.trim().split('\n');
    if (lines.length < 3) {
      await ctx.reply(
        ctx.t(
          i18nKeys.i18n.command.quizAdmin.scene
            .error_quiz_has_incorrect_structure,
        ),
      );
      await this.send_create_quiz_question_message_example(ctx);
      ctx.wizard.selectStep(1);
    }

    const question = lines[0].trim();
    const options = lines[1].split(',').map((ans) => ans.trim());
    const correctAnswer = lines[2].trim();
    let correctIndex: number;
    if (/^\d+$/.test(correctAnswer)) {
      correctIndex = parseInt(correctAnswer, 10) - 1;
      if (options.length < correctIndex) {
        const message = `${ctx.t(i18nKeys.i18n.command.quizAdmin.scene.error_quiz_has_correct_answer_does_not_exists)}: ${correctIndex}`;
        await ctx.reply(message);
        await this.send_create_quiz_question_message_example(ctx);
        ctx.wizard.selectStep(1);
      }
    } else {
      correctIndex = options.findIndex(
        (ans) => ans.toLowerCase() === correctAnswer.toLowerCase(),
      );
      if (correctIndex < 0) {
        const message = `${ctx.t(i18nKeys.i18n.command.quizAdmin.scene.error_quiz_has_correct_answer_does_not_exists)}: ${correctAnswer}`;
        await ctx.reply(message);
        await this.send_create_quiz_question_message_example(ctx);
        ctx.wizard.selectStep(1);
      }
    }

    ctx.wizard.state['quiz'] = {
      question,
      options: JSON.stringify(options),
      correctAnswerIndex: correctIndex,
      image: photo || null,
    };

    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.t(
            i18nKeys.i18n.command.quizAdmin.buttons.create_quiz_preview,
          ),
          callback_data: TELEGRAM_BTN_ACTIONS.PREVIEW_QUIZ,
        },
        {
          text: ctx.t(
            i18nKeys.i18n.command.quizAdmin.buttons.save_quiz,
          ),
          callback_data: TELEGRAM_BTN_ACTIONS.SAVE_QUIZ,
        }
      ],
      [this.getLeaveButton(ctx)]
    ];
    await ctx.reply(
      ctx.t(i18nKeys.i18n.command.quizAdmin.scene.create_quiz_can_be_accepted),
      { reply_markup: { inline_keyboard: buttons } },
    );
  }

  @Action(TELEGRAM_BTN_ACTIONS.QUIZ_ADMIN_CREATE)
  async createQuiz(@Ctx() ctx: WizardI18nContext) {
    this.logger.log(`Quiz create was initiated`);
    const buttons: InlineKeyboardButton[][] = [
      [
        {
          text: ctx.t(
            i18nKeys.i18n.command.quizAdmin.buttons.create_quiz_example,
          ),
          callback_data: TELEGRAM_BTN_ACTIONS.QUIZ_ADMIN_CREATE_EXAMPLE,
        },
      ],
    ];
    await ctx.reply(
      ctx.t(i18nKeys.i18n.command.quizAdmin.scene.create_quiz_question_message),
      {
        reply_markup: { inline_keyboard: buttons },
      },
    );
    ctx.wizard.selectStep(1);
  }

  @Action(TELEGRAM_BTN_ACTIONS.QUIZ_ADMIN_CREATE_EXAMPLE)
  async createQuizExample(@Ctx() ctx: WizardI18nContext) {
    await ctx.reply(
      ctx.t(
        i18nKeys.i18n.command.quizAdmin.scene
          .create_quiz_question_message_example,
      ),
    );
  }

  @Action(TELEGRAM_BTN_ACTIONS.PREVIEW_QUIZ)
  async previewQuiz(@Ctx() ctx: WizardI18nContext) {
    const quiz: Partial<QuizQuestion> = ctx.wizard.state['quiz'];
    this.logger.log(`Previewing quiz question ${quiz.question}`);
    await this.telegrafService.sendQuizToChatId(
      ctx.chat.id,
      quiz.question,
      JSON.parse(quiz.options),
      quiz.correctAnswerIndex,
    );
  }

  @Action(TELEGRAM_BTN_ACTIONS.SAVE_QUIZ)
  async saveQuiz(@Ctx() ctx: WizardI18nContext) {
    const quiz: Partial<QuizQuestion> = ctx.wizard.state['quiz'];
    this.logger.log(`Saving quiz question ${quiz.question}`);
    await ctx.reply(
      ctx.t(
        i18nKeys.i18n.command.quizAdmin.scene
          .create_quiz_saving,
      )
    );
    await ctx.scene.leave();
  }

  async send_create_quiz_question_message_example(ctx: WizardI18nContext) {
    const leave_button: InlineKeyboardButton[][] = [[this.getLeaveButton(ctx)]];
    await ctx.reply(
      ctx.t(
        i18nKeys.i18n.command.quizAdmin.scene
          .create_quiz_question_message_example,
      ),
      { reply_markup: { inline_keyboard: leave_button } },
    );
  }
}
