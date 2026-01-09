import { Injectable } from '@nestjs/common';
import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';
import { TelegramUser } from '@prisma/client';

@Injectable()
export class TelegramUserRepositoryV3Service extends AbstractRepositoryV3<TelegramUser> {
  async readByTelegramId(telegramId: number | bigint): Promise<TelegramUser | null> {
    return this.findUnique({
      where: { telegramId }
    });
  }

  async existsByTelegramId(telegramId: number | bigint): Promise<boolean> {
    return this.exists({ telegramId });
  }
}

