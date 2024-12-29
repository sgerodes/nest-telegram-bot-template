import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstractRepository';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepositoryService extends AbstractRepository<
    User, Prisma.UserDelegate, Prisma.UserCreateInput
> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.user);
  }

  async readByTelegramId(telegramId: number): Promise<User | null> {
    return this.readByUnique('telegramId', telegramId);
  }

  async existsByTelegramId(telegramId: number): Promise<boolean> {
    return this.exists('telegramId', telegramId);
  }
}
