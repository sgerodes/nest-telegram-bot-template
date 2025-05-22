import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SessionQuizService {
  protected readonly logger = new Logger(this.constructor.name);
}
