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
    this.logger.debug(`SaveUserMiddleware called`);
    if (!(await this.userRepositoryService.existsByTelegramId(ctx.from.id))) {
      const _user = await this.userRepositoryService.createData({
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name
      });
      this.logger.debug(`Saved user middleware for telegram id=${ctx.from.id}, ${_user}`);
    } else {
      this.logger.debug(`User already exists telegram id=${ctx.from.id}`);
    }
    await next();
  }
}
