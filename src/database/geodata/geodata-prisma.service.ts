import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma-geodata/client';
import { DatabaseConfig } from '@configuration/validation/configuration.validators';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class GeodataPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(this.constructor.name);
  private readonly pool: pg.Pool;

  constructor(databaseConfig: DatabaseConfig) {
    const pool = new pg.Pool({ connectionString: databaseConfig.geodataUrl });
    const adapter = new PrismaPg(pool);

    super({ adapter });

    this.pool = pool;
    this.patchDelegates();
  }

  async onModuleInit() {
    this.logger.log('Connecting to geodata database...');
    await this.$connect();
    this.logger.log('Geodata database connection established.');
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
    this.logger.log('Disconnecting from geodata database...');
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Geodata database connection closed.');
  }
}
