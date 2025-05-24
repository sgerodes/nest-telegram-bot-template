
export class QuizQuestionCreationDto {
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

  static fromJSON(json: any): QuizQuestionCreationDto {
    return new QuizQuestionCreationDto(
      json.question,
      json.answers,
      json.correct_answer,
      json.advice
    );
  }
}

export class Quiz {
  questions: QuizQuestionCreationDto[];

  constructor(questions: QuizQuestionCreationDto[]) {
    this.questions = questions;
  }

  static fromJSON(jsonArray: any[]): Quiz {
    const questions = jsonArray.map(QuizQuestionCreationDto.fromJSON);
    return new Quiz(questions);
  }
}
