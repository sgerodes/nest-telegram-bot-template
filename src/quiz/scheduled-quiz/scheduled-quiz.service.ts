import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ScheduledQuizService {
  protected readonly logger = new Logger(this.constructor.name);
}
