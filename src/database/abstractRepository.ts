import { Logger } from '@nestjs/common';

export class AbstractRepository<T> {
  protected readonly modelDelegate;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(modelDelegate) {
    this.modelDelegate = modelDelegate;

    // TODO checks
    // const typeName: string = (T as any).toString();
    // if (!this.constructor.name.includes(typeName)){
    //   this.logger.warn(`${this.constructor.name} does not include the typeName ${typeName}`)
    // }
  }

  async readById(id: number): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { id },
    });
  }

  async create(obj: T): Promise<T> {
    return this.modelDelegate.create(
      {
        data: obj
      }
    );
  }


}