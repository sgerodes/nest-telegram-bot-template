import { Logger } from '@nestjs/common';

export class AbstractRepository<T, Delegate extends {
  findUnique: (args: any) => Promise<T | null>;
  findFirst: (args: any) => Promise<T | null>;
  count: (args: any) => Promise<number>;
  create: (args: any) => Promise<T>;
}, CreateInput> {
  protected readonly modelDelegate: Delegate;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(modelDelegate: Delegate) {
    this.modelDelegate = modelDelegate;
    // this.create = this.modelDelegate.create.bind(this.modelDelegate);
  }

  async createData(obj: CreateInput): Promise<T> {
    return this.modelDelegate.create(
      {
        data: obj
      }
    );
  }

  async readById(id: number): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { id },
    });
  }


  async readByUnique(column: keyof T, value: any): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { [column]: value },
    });
  }

  async readFirst(column: keyof T, value: any): Promise<T | null> {
    return this.modelDelegate.findFirst({
      where: { [column]: value },
    });
  }

  async exists(column: keyof T, value: any): Promise<boolean> {
    return await this.readFirst(column, value) !== null;
  }

}