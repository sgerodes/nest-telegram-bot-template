import { Injectable, Logger } from "@nestjs/common";
import { Context } from "telegraf";
import { UserRepositoryService } from '@database/user-repository/user-repository.service';

@Injectable()
export class SaveUserMiddleware{
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly userRepositoryService: UserRepositoryService) {
    this.saveUserMiddleware = this.saveUserMiddleware.bind(this);
  }

  async saveUserMiddleware(ctx: Context, next: () => Promise<void>) {
    if (!(await this.userRepositoryService.existsByTelegramId(ctx.from.id))) {
      const _user = await this.userRepositoryService.createData({
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name
      });
    }
    await next();
  }
}
