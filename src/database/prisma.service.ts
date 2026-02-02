import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    super({
      datasourceUrl: process.env.DATABASE_URL,
    });
    this.patchDelegates();
  }

  async onModuleInit() {
    this.logger.log('Connecting to the db...');
    await this.$connect();
    this.logger.log('Database connection established.');
  }

  private patchDelegates() {
    const modelNames = Object.values(Prisma.ModelName);
    for (const modelName of modelNames) {
      const delegateKey =
        modelName.charAt(0).toLowerCase() + modelName.slice(1);
      const delegate = (this as any)[delegateKey];
      if (delegate) {
        delegate.$modelName = modelName;
      }
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the db...');
    await this.$disconnect();
    this.logger.log('Database connection closed.');
  }
}
