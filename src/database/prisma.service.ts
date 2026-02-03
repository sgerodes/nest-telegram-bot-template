import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { DatabaseConfig } from '@configuration/validation/configuration.validators';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(this.constructor.name);

  constructor(databaseConfig: DatabaseConfig) {
    const adapter = new PrismaLibSql({ url: databaseConfig.url });

    super({ adapter });

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
