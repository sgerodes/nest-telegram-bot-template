import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstract.repository';
import { Prisma, TelegramUser } from '@prisma/client';

@Injectable()
export class UserRepositoryService extends AbstractRepository<
  TelegramUser,
  Prisma.TelegramUserDelegate,
  Prisma.TelegramUserCreateInput
> {
  constructor(private readonly prisma: PrismaService) {
    super(prisma.telegramUser);
  }

  async readByTelegramId(telegramId: number): Promise<TelegramUser | null> {
    return this.readByUnique('telegramId', telegramId);
  }

  async existsByTelegramId(telegramId: number): Promise<boolean> {
    return this.exists('telegramId', telegramId);
  }
}
