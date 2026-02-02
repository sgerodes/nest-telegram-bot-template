import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { TelegramUser } from '@prisma/client';

@Injectable()
export class TelegramUserRepository extends AbstractRepositoryV3<TelegramUser> {
  async findByTelegramId(telegramId: number): Promise<TelegramUser | null> {
    return this.findUnique({
      where: { telegramId }
    });
  }

  async existsByTelegramId(telegramId: number): Promise<boolean> {
    return this.exists({ telegramId });
  }
}
