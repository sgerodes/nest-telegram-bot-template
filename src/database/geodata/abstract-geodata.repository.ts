import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { GeodataPrismaService } from './geodata-prisma.service';

/**
 * AbstractGeodataRepository
 *
 * A read-only base repository for geodata models.
 * Provides only read operations since geodata is reference data.
 *
 * @template T The Prisma Model type.
 */
export abstract class AbstractGeodataRepository<T> implements OnModuleInit {
  @Inject(GeodataPrismaService)
  protected readonly prisma: GeodataPrismaService;

  protected readonly logger = new Logger(this.constructor.name);

  public delegate: {
    findUnique: (args: any) => Promise<T>;
    findFirst: (args: any) => Promise<T>;
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
  };

  onModuleInit() {
    const className = this.constructor.name;

    const allDelegateKeys = Object.keys(this.prisma).filter((key) => {
      const prop = (this.prisma as any)[key];
      return prop && typeof prop === 'object' && prop.$modelName;
    });

    const foundKey = allDelegateKeys.find((key) => {
      const modelName = (this.prisma as any)[key].$modelName;
      return className.toLowerCase().includes(modelName.toLowerCase());
    });

    if (!foundKey) {
      this.logger.error(
        `Could not automatically find Prisma delegate for ${className}. ` +
          `Available models: ${allDelegateKeys.map((k) => (this.prisma as any)[k].$modelName).join(', ')}`,
      );
      throw new Error(`Failed to initialize repository: ${className}`);
    }

    this.delegate = (this.prisma as any)[foundKey];
  }

  async findUnique(
    args: Parameters<this['delegate']['findUnique']>[0],
  ): Promise<T | null> {
    return this.delegate.findUnique(args);
  }

  async findFirst(
    args: Parameters<this['delegate']['findFirst']>[0],
  ): Promise<T | null> {
    return this.delegate.findFirst(args);
  }

  async findMany(
    args?: Parameters<this['delegate']['findMany']>[0],
  ): Promise<T[]> {
    return this.delegate.findMany(args);
  }

  async count(args?: Parameters<this['delegate']['count']>[0]): Promise<number> {
    return this.delegate.count(args);
  }

  async exists(
    where: Parameters<this['delegate']['findFirst']>[0]['where'],
  ): Promise<boolean> {
    const result = await this.delegate.findFirst({ where });
    return result !== null;
  }
}
