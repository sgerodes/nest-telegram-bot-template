import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV2 } from '@database/abstract.repository.v2';
import { TelegramUser } from '@prisma/client';

@Injectable()
export class TelegramUserRepositoryV2Service extends AbstractRepositoryV2<TelegramUser> {
  async readByTelegramId(telegramId: number | bigint): Promise<TelegramUser | null> {
    return this.findUnique({
      where: { telegramId }
    });
  }

  async existsByTelegramId(telegramId: number | bigint): Promise<boolean> {
    return this.exists({ telegramId });
  }
}
