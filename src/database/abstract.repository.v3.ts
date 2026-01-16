import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

/**
 * AbstractRepository V3
 *
 * A base repository providing common database operations with automatic model discovery.
 * The correct Prisma delegate is automatically found based on the class name.
 *
 * @template T The Prisma Model type.
 */
export abstract class AbstractRepositoryV3<T> implements OnModuleInit {
  @Inject(PrismaService)
  protected readonly prisma: PrismaService;

  protected readonly logger = new Logger(this.constructor.name);

  /**
   * The Prisma delegate for the specific model.
   * Automatically discovered in onModuleInit.
   */
  public delegate: {
    create: (args: any) => Promise<any>;
    findUnique: (args: any) => Promise<any>;
    findFirst: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any[]>;
    count: (args: any) => Promise<number>;
    update: (args: any) => Promise<any>;
    delete: (args: any) => Promise<any>;
  };

  /**
   * Automatically discovers the Prisma delegate based on the class name.
   */
  onModuleInit() {
    const className = this.constructor.name;

    // Iterate over all properties in PrismaService to find patched delegates
    const allDelegateKeys = Object.keys(this.prisma).filter((key) => {
      const prop = (this.prisma as any)[key];
      return prop && typeof prop === 'object' && prop.$modelName;
    });

    const foundKey = allDelegateKeys.find((key) => {
      const modelName = (this.prisma as any)[key].$modelName;
      // Check if the class name contains the model name (case-insensitive)
      return className.toLowerCase().includes(modelName.toLowerCase());
    });

    if (!foundKey) {
      this.logger.error(
        `Could not automatically find Prisma delegate for ${className}. ` +
        `Available models: ${allDelegateKeys.map(k => (this.prisma as any)[k].$modelName).join(', ')}`
      );
      throw new Error(`Failed to initialize repository: ${className}`);
    }

    this.delegate = (this.prisma as any)[foundKey];
    // this.logger.debug(`Automatically linked ${className} to Prisma model: ${(this.delegate as any).$modelName}`);
  }

  /**
   * Creates a new record using standard Prisma arguments.
   */
  async create(args: Parameters<this['delegate']['create']>[0]): Promise<T> {
    return this.delegate.create(args);
  }

  /**
   * Helper to create a record directly from data.
   */
  async createData(data: Parameters<this['delegate']['create']>[0]['data']): Promise<T> {
    return this.delegate.create({ data });
  }

  /**
   * Finds a unique record using standard Prisma arguments (supports where, include, select).
   */
  async findUnique(args: Parameters<this['delegate']['findUnique']>[0]): Promise<T | null> {
    return this.delegate.findUnique(args);
  }

  /**
   * Finds the first record matching the criteria using standard Prisma arguments.
   */
  async findFirst(args: Parameters<this['delegate']['findFirst']>[0]): Promise<T | null> {
    return this.delegate.findFirst(args);
  }

  /**
   * Checks if a record exists matching the provided where criteria.
   */
  async exists(where: Parameters<this['delegate']['findFirst']>[0]['where']): Promise<boolean> {
    const result = await this.delegate.findFirst({ where });
    return result !== null;
  }

  /**
   * Finds a record by its primary ID.
   */
  async readById(id: number): Promise<T | null> {
    return this.delegate.findUnique({
      where: { id } as any,
    });
  }

  /**
   * Counts records matching the criteria.
   */
  async count(args?: Parameters<this['delegate']['count']>[0]): Promise<number> {
    return this.delegate.count(args);
  }

  /**
   * Updates a record using standard Prisma arguments.
   */
  async update(args: Parameters<this['delegate']['update']>[0]): Promise<T> {
    return this.delegate.update(args);
  }

  /**
   * Deletes a record using standard Prisma arguments.
   */
  async delete(args: Parameters<this['delegate']['delete']>[0]): Promise<T> {
    return this.delegate.delete(args);
  }
}

