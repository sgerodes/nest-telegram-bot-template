import { SCENES } from '@configuration/telegramConstants';
import { Ctx, SceneEnter, Wizard } from 'nestjs-telegraf';
import { Logger } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { ITelegrafI18nContext } from '@telegram/interface';
import { I18nTranslations } from '@i18n/i18n.generated';
import { TelegramConfig } from '@configuration/validation/configuration.validators';
import { TelegrafService } from '@telegram/telegraf.service';
import * as fs from 'fs';
import * as path from 'path';
import { shuffleArray } from '@telegram/utils';


export class QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: number;
  advice: string;

  constructor(
    question: string,
    answers: string[],
    correctAnswer: number,
    advice: string
  ) {
    this.question = question;
    this.answers = answers;
    this.correctAnswer = correctAnswer;
    this.advice = advice;
  }

  static fromJSON(json: any): QuizQuestion {
    return new QuizQuestion(
      json.question,
      json.answers,
      json.correct_answer,
      json.advice
    );
  }
}

export class Quiz {
  questions: QuizQuestion[];

  constructor(questions: QuizQuestion[]) {
    this.questions = questions;
  }

  static fromJSON(jsonArray: any[]): Quiz {
    const questions = jsonArray.map(QuizQuestion.fromJSON);
    return new Quiz(questions);
  }
}

@Wizard(SCENES.SCENE_QUIZ)
export class SceneQuiz {
  private readonly logger = new Logger(this.constructor.name);
  private readonly quizzes: Quiz[] = [];


  constructor(
    private readonly telegramConfig: TelegramConfig,
    private readonly telegrafService: TelegrafService,
  ) {
    this.quizzes = this.readQuizzes();
  }

  readQuizzes(): Quiz[] {
    this.logger.log(`Reading quizzes from ${this.telegramConfig.quiz.quizQuestionDirectory}`);

    const quizDir = this.telegramConfig.quiz.quizQuestionDirectory;
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
  async onEnter(
    @Ctx() ctx: Scenes.WizardContext & ITelegrafI18nContext<I18nTranslations>,
  ) {
    if (this.quizzes.length === 0) {
      this.logger.warn('No quizzes loaded.');
      await ctx.reply('No quizzes available.');
      await ctx.scene.leave();
      return;
    }

    const randomQuiz = this.quizzes[Math.floor(Math.random() * this.quizzes.length)];

    if (randomQuiz.questions.length === 0) {
      this.logger.warn('Selected quiz has no questions.');
      await ctx.reply('Selected quiz has no questions.');
      await ctx.scene.leave();
      return;
    }

    const randomQuestion = randomQuiz.questions[Math.floor(Math.random() * randomQuiz.questions.length)];

    const correctAnswerText = randomQuestion.answers[randomQuestion.correctAnswer];
    const shuffledAnswers = shuffleArray([...randomQuestion.answers]);
    const newCorrectAnswerIndex = shuffledAnswers.indexOf(correctAnswerText);

    // Send the randomized quiz question
    await this.telegrafService.sendQuizToChatId(
      ctx.from.id.toString(),
      randomQuestion.question,
      shuffledAnswers,
      newCorrectAnswerIndex,
      false,
    );

    await ctx.scene.leave();
  }
}
