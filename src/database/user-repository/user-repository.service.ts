import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { AbstractRepository } from '@database/abstractRepository';
import { User } from '@prisma/client';

@Injectable()
export class UserRepositoryService extends AbstractRepository<User> {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super(prisma.user);
  }
}
