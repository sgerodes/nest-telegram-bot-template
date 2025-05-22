import { BOT_ON, SCENES } from '@configuration/telegramConstants';
import { Action, Ctx, SceneEnter, Wizard } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { ITelegrafI18nContext } from '@telegram/interfaces';
import { I18nTranslations } from '@i18n/i18n.generated';
import { QuizConfig, TelegramConfig } from '@configuration/validation/configuration.validators';
import { TelegrafService } from '@telegram/telegraf.service';
import * as fs from 'fs';
import * as path from 'path';
import { shuffleArray } from '@telegram/utils';
import { Quiz, QuizQuestion } from '@telegram/models';

@Wizard(SCENES.SCENE_QUIZ)
export class SceneQuiz {
  private readonly logger = new Logger(this.constructor.name);
  private readonly quizzes: Quiz[] = [];
  private readonly userAnsweredQuestions: Record<string, Set<string>> = {};

  constructor(
    private readonly telegramConfig: TelegramConfig,
    private readonly quizConfig: QuizConfig,
    private readonly telegrafService: TelegrafService,
  ) {
    this.quizzes = this.readQuizzes();
  }

  readQuizzes(): Quiz[] {
    this.logger.log(`Reading quizzes from ${this.quizConfig.quizQuestionDirectory}`);

    const quizDir = this.quizConfig.quizQuestionDirectory;
    try {
      const files = fs.readdirSync(quizDir);

      const quizzes = files.flatMap((dir) => {
        const quizPath = path.join(quizDir, dir);
        if (fs.lstatSync(quizPath).isDirectory()) {
          const jsonFiles = fs.readdirSync(quizPath).filter(file => file.endsWith('.json'));

          return jsonFiles.map(jsonFile => {
            const filePath = path.join(quizPath, jsonFile);
            try {
              const data = fs.readFileSync(filePath, 'utf-8');
              const json = JSON.parse(data);
              return Quiz.fromJSON(json);
            } catch (error) {
              this.logger.error(`Error reading file ${filePath}: ${error.message}`);
              return null;
            }
          }).filter(Boolean);
        }
        return [];
      });

      this.logger.log(`Loaded ${quizzes.length} quizzes successfully.`);
      return quizzes;
    } catch (error) {
      this.logger.error(`Error reading quiz directory: ${error.message}`);
      return [];
    }
  }

  @SceneEnter()
  async onEnter(@Ctx() ctx: Scenes.WizardContext & ITelegrafI18nContext<I18nTranslations>) {
    const userId = ctx.from.id.toString();

    if (this.quizzes.length === 0) {
      this.logger.warn('No quizzes loaded.');
      await ctx.reply('No quizzes available.');
      await ctx.scene.leave();
      return;
    }

    // let availableQuestions: QuizQuestion[] = [];
    // this.quizzes.forEach(quiz => {
    //   quiz.questions.forEach(question => {
    //     if (!this.userAnsweredQuestions[userId]?.has(question.question)) {
    //       availableQuestions.push(question);
    //     }
    //   });
    // });
    //
    // if (availableQuestions.length === 0) {
    //   await ctx.reply("You've answered all available questions! 🎉");
    //   await ctx.scene.leave();
    //   return;
    // }

    // const randomQuestion: Quiz = this.quizzes[Math.floor(Math.random() * this.quizzes.length)];
    //
    // const correctAnswerText: string = randomQuestion.questions.answers[randomQuestion.correctAnswer];
    // const shuffledAnswers = shuffleArray([...randomQuestion.answers]);
    // const newCorrectAnswerIndex = shuffledAnswers.indexOf(correctAnswerText);
    //
    // // if (!this.userAnsweredQuestions[userId]) {
    // //   this.userAnsweredQuestions[userId] = new Set();
    // // }
    // // this.userAnsweredQuestions[userId].add(randomQuestion.question);
    //
    // await this.telegrafService.sendQuizToChatId(
    //   ctx.from.id.toString(),
    //   randomQuestion.question,
    //   shuffledAnswers,
    //   newCorrectAnswerIndex,
    //   false,
    // );

    // if (!ctx.wizard.state) {
    //   (ctx.wizard.state as Record<string, any>) = {};
    // }
    //
    // (ctx.wizard.state as Record<string, any>).quizData = {
    //   question: randomQuestion.question,
    //   correctAnswerIndex: newCorrectAnswerIndex,
    // };
  }
  //
  // @Action(BOT_ON.POLL_ANSWER)
  // async onAnswer(@Ctx() ctx: Scenes.WizardContext & ITelegrafI18nContext<I18nTranslations>) {
  //   const userId = ctx.from.id.toString();
  //   const callbackQuery = ctx.callbackQuery as { data?: string };
  //   const answerIndex = parseInt(callbackQuery.data || '-1', 10);
  //
  //   const quizData = (ctx.wizard.state as Record<string, any>).quizData;
  //
  //   if (!quizData) {
  //     return;
  //   }
  //
  //   const { question, correctAnswerIndex } = quizData;
  //
  //   if (answerIndex === correctAnswerIndex) {
  //     this.userAnsweredQuestions[userId].delete(question);
  //   }
  //
  //   // await this.onEnter(ctx);
  // }
}
