import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstractRepository';
import {PrismaClient, User} from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepositoryService extends AbstractRepository<User, Prisma.UserDelegate> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.user);

    // type UserDelegate = Prisma.UserDelegate;
    // type User = Prisma.UserDelegate<{}>['[K: symbol]']['types']['model'];
  }

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async readByTelegramId(telegramId: number): Promise<User | null> {
    return this.readByUnique('telegramId', telegramId);
  }

  async existsByTelegramId(telegramId: number): Promise<boolean> {
    return this.exists('telegramId', telegramId);
  }


}
