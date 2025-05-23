
export class QuizQuestion {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
  photo?: Buffer;
  date?: Date;
  advice?: string;

  constructor(
    question: string,
    answers: string[],
    correctAnswer: number,
    photo?: Buffer,
    date?: Date,
    advice?: string,
  ) {
    this.question = question;
    this.date = date;
    this.answers = answers;
    this.correctAnswerIndex = correctAnswer;
    this.photo = photo;
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
