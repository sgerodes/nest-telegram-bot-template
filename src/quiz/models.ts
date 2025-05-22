
export class TelegramQuizQuestion {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  advice: string;

  constructor(
    question: string,
    answers: string[],
    correctAnswer: number,
    advice: string
  ) {
    this.question = question;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswer;
    this.advice = advice;
  }

  static fromJSON(json: any): TelegramQuizQuestion {
    return new TelegramQuizQuestion(
      json.question,
      json.answers,
      json.correct_answer,
      json.advice
    );
  }
}

export class Quiz {
  questions: TelegramQuizQuestion[];

  constructor(questions: TelegramQuizQuestion[]) {
    this.questions = questions;
  }

  static fromJSON(jsonArray: any[]): Quiz {
    const questions = jsonArray.map(TelegramQuizQuestion.fromJSON);
    return new Quiz(questions);
  }
}


export type QuizType = 'SCHEDULED' | 'SESSION';

