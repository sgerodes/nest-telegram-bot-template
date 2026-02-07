import { Injectable } from '@nestjs/common';
import { City } from '@prisma-geodata/client';
import { AbstractGeodataRepository } from './abstract-geodata.repository';

@Injectable()
export class CityRepository extends AbstractGeodataRepository<City> {
  async findCapitalByCountry(countryAlpha2: string): Promise<City | null> {
    return this.findFirst({
      where: {
        countryAlpha2: countryAlpha2.toUpperCase(),
        isCapital: true,
        capitalType: 'primary',
      },
    });
  }

  async findAllCapitals(): Promise<City[]> {
    return this.findMany({
      where: { isCapital: true },
      include: { country: true },
      orderBy: { name: 'asc' },
    });
  }

  async getRandomCapitals(count: number): Promise<City[]> {
    const total = await this.count({ where: { isCapital: true } });
    return this.findMany({
      where: { isCapital: true },
      include: { country: true },
      take: count,
      skip: Math.floor(Math.random() * Math.max(0, total - count)),
    });
  }
}
