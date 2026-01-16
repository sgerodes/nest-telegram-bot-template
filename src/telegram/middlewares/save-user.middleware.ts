import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';

@Injectable()
export class SaveUserMiddleware{
  constructor(private readonly userRepository: TelegramUserRepository) {
    this.saveUserMiddleware = this.saveUserMiddleware.bind(this);
  }

  async saveUserMiddleware(ctx: Context, next: () => Promise<void>) {
    if (!(await this.userRepository.existsByTelegramId(ctx?.from?.id))) {
      await this.userRepository.createData({
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name
      });
    }
    await next();
  }
}
