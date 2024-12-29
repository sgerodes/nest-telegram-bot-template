import { Logger } from '@nestjs/common';

export class AbstractRepository<T, Delegate extends {
  findUnique: (args: any) => Promise<T | null>;
  findFirst: (args: any) => Promise<T | null>;
  count: (args: any) => Promise<number>;
  create: (args: any) => Promise<T>;
}> {
  protected readonly modelDelegate: Delegate;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(modelDelegate: Delegate) {
    this.modelDelegate = modelDelegate;

    // this.create = this.modelDelegate.create.bind(this.modelDelegate);

  }

  // create: typeof this.modelDelegate.create;
  // async create(obj: any): Promise<T> {
  //   return this.modelDelegate.create(
  //     {
  //       data: obj
  //     }
  //   );
  // }
  // async create(data: Parameters<typeof this.modelDelegate.create>[0]['data']): Promise<T> {
  //   return this.modelDelegate.create({
  //     data,
  //   });
  // }


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