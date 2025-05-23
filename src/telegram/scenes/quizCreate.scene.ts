import { SCENES, TELEGRAM_BTN_ACTIONS } from '@configuration/telegramConstants';
import { i18nKeys } from '@i18n/i18n.keys';
import { Action, Ctx, SceneEnter, Wizard, WizardStep } from 'nestjs-telegraf';
import { WizardI18nContext } from '@telegram/utils';
import { BaseTelegramHandler } from '@telegram/abstract.base.telegram.handler';
import { Message } from 'telegraf/typings/core/types/typegram';
import { QuizQuestion } from '@telegram/models';
import { TelegrafService } from '@telegram/telegraf.service';
import { parse, isValid, format } from 'date-fns';
import { RootConfig, TelegramConfig } from '@configuration/validation/configuration.validators';

@Wizard(SCENES.SCENE_QUESTION_CREATE)
export class SceneQuizCreate extends BaseTelegramHandler {
  constructor(
    private readonly telegrafService: TelegrafService,
    private readonly rootConfig: RootConfig,
    ) {
    super();
  }

  @SceneEnter()
  // @WizardStep(0)
  async onEnter(@Ctx() ctx: WizardI18nContext) {
    this.logger.debug(`Entering SceneQuizManager step 0`);
    await ctx.tReply(
      i18nKeys.i18n.command.quizAdmin.scene
        .create_quiz_question_message_example,
    );
  }

  @WizardStep(1)
  async handleQuizQuestionInput(@Ctx() ctx: WizardI18nContext) {
    this.logger.log(`Entering step 1`);
    const message = ctx.message as Message.TextMessage  | Message.PhotoMessage;

    const text = 'text' in message ? message.text
        : 'caption' in message ? message.caption
        : null;

    if (!text) {
      this.logger.log(`No text provided: ${text}`);
      const msg = ctx.t(
        i18nKeys.i18n.command.quizAdmin.scene.error_no_quiz_provided,
      );
      await ctx.reply(msg, {
        reply_markup: { inline_keyboard: [[this.getLeaveButton(ctx)]] },
      });
      ctx.wizard.selectStep(1);
    }

    let photo: Buffer = null;
    if ('photo' in message && message.photo ){
      const best = message.photo.at(-1); // last = largest
      const fileId = best.file_id;
      // const photoFileId: string | null = 'photo' in message ? message.photo?.[0]?.file_id : null;
      photo = await this.telegrafService.getFileByFileId(fileId);
      this.logger.debug("Photo was provided to the question");
    }


    this.logger.log(`Question received ${text}. Will try to parse`);
    const quizQuestion = await this.parseQuestionInput(ctx, text, photo);
    if (quizQuestion == null) {
      ctx.wizard.selectStep(1);
    }

    await this.previewQuestion(ctx, quizQuestion, photo);
    ctx.wizard.state['quiz'] = quizQuestion;

    await ctx.reply("Save this question?", {
      reply_markup: { inline_keyboard: [
          [
            {
              text: "Yes",
              callback_data: TELEGRAM_BTN_ACTIONS.SAVE_QUIZ,
            },
            {
              text: "No",
              callback_data: TELEGRAM_BTN_ACTIONS.NOT_SAVE_QUIZ,
            }
          ]
        ]
      },
    });
  }

  @Action(TELEGRAM_BTN_ACTIONS.SAVE_QUIZ)
  async saveQuiz(@Ctx() ctx: WizardI18nContext) {
    const quiz = ctx.wizard.state['quiz'];
    await ctx.reply(`Saving quiz TODO ${quiz.question}`);
  }

  @Action(TELEGRAM_BTN_ACTIONS.NOT_SAVE_QUIZ)
  async notSaveQuiz(@Ctx() ctx: WizardI18nContext) {
    await ctx.reply("Not saving quiz TODO");
  }

  async previewQuestion(ctx: WizardI18nContext, quizQuestion: QuizQuestion, photo: Buffer) {

    await ctx.reply(`Preview of the quiz. Will be published on ${format(quizQuestion.date, 'dd.MM.yyyy')} at ${this.rootConfig.quiz.dailyScheduledQuizPostTime}. Correct answer is "${quizQuestion.answers[quizQuestion.correctAnswerIndex]}"`)
    await this.telegrafService.sendQuizToChatId(ctx.chat.id,
        quizQuestion.question,
        quizQuestion.answers,
        quizQuestion.correctAnswerIndex,
        photo,
      )
  }

  async parseQuestionInput(
    @Ctx() ctx: WizardI18nContext,
    text: string,
    photo: Buffer,
  ): Promise<QuizQuestion | null> {
    const lines = text.trim().split('\n');
    if (lines.length < 4) {
      await ctx.reply(
        ctx.t(
          i18nKeys.i18n.command.quizAdmin.scene
            .error_quiz_has_incorrect_structure,
        ),
        {
          reply_markup: { inline_keyboard: [[this.getLeaveButton(ctx)]] },
        },
      );
      ctx.wizard.selectStep(1);
    }

    const dateString = lines[0].trim();
    const date = parse(dateString, 'dd.MM.yyyy', new Date());
    if (!isValid(date)) {
      await ctx.reply(
        ctx.t(i18nKeys.i18n.command.quizAdmin.scene.error_invalid_date_format),
        {
          reply_markup: { inline_keyboard: [[this.getLeaveButton(ctx)]] },
        },
      );
      return null;
    }

    const question = lines[1].trim();
    const answers = lines[2].split(',').map((ans) => ans.trim());
    const correctAnswer = lines[3].trim();
    let correctIndex: number;
    if (/^\d+$/.test(correctAnswer)) {
      correctIndex = parseInt(correctAnswer, 10) - 1;
      if (answers.length < correctIndex) {
        const message = `${ctx.t(i18nKeys.i18n.command.quizAdmin.scene.error_quiz_has_correct_answer_does_not_exists)}: ${correctIndex + 1}`;
        await ctx.reply(message);
        return null;
      }
    } else {
      correctIndex = answers.findIndex(
        (ans) => ans.toLowerCase() === correctAnswer.toLowerCase(),
      );
      if (correctIndex < 0) {
        const message = `${ctx.t(i18nKeys.i18n.command.quizAdmin.scene.error_quiz_has_correct_answer_does_not_exists)}: ${correctAnswer}`;
        await ctx.reply(message);
        return null;
      }
    }
    return new QuizQuestion(question, answers, correctIndex, photo, date);
  }
}
