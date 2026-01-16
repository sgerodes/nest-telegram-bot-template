import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';

@Injectable()
export class SaveUserMiddleware{
  constructor(private readonly userRepository: TelegramUserRepository) {
    this.saveUserMiddleware = this.saveUserMiddleware.bind(this);
  }

  async saveUserMiddleware(ctx: Context, next: () => Promise<void>) {
    const telegramUserId = ctx.from.id;
    if (!(await this.userRepository.existsByTelegramId(telegramUserId))) {
      await this.userRepository.createData({
        telegramId: telegramUserId,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name
      });
    }
    await next();
  }
}
