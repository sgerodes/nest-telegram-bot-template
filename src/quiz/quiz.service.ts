import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QuizService {
  protected readonly logger = new Logger(this.constructor.name);

}
