import { Inject, Logger } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';

/**
 * AbstractRepository V2
 * 
 * A base repository providing common database operations with minimal boilerplate.
 * Child classes should define a `delegate` getter pointing to the specific Prisma model.
 * All methods accept standard Prisma argument objects for maximum flexibility and type safety.
 * 
 * @template T The Prisma Model type.
 */
export abstract class AbstractRepositoryV2<T> {
  @Inject(PrismaService)
  protected readonly prisma: PrismaService;

  protected readonly logger = new Logger(this.constructor.name);

  /**
   * The Prisma delegate for the specific model.
   * This must be public to allow type inference in the base class.
   */
  public abstract get delegate(): {
    create: (args: any) => Promise<T>;
    findUnique: (args: any) => Promise<T | null>;
    findFirst: (args: any) => Promise<T | null>;
    count: (args: any) => Promise<number>;
    update: (args: any) => Promise<T>;
    delete: (args: any) => Promise<T>;
  };

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
