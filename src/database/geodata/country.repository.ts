import { Injectable } from '@nestjs/common';
import { Country } from '@prisma-geodata/client';
import { AbstractGeodataRepository } from './abstract-geodata.repository';

@Injectable()
export class CountryRepository extends AbstractGeodataRepository<Country> {
  async findByAlpha2(alpha2: string): Promise<Country | null> {
    return this.findUnique({ where: { alpha2: alpha2.toUpperCase() } });
  }

  async findByAlpha3(alpha3: string): Promise<Country | null> {
    return this.findFirst({ where: { alpha3: alpha3.toUpperCase() } });
  }

  async findAllWithCapitals(): Promise<Country[]> {
    return this.findMany({
      include: {
        cities: {
          where: { isCapital: true },
        },
      },
    });
  }

  async findByRegion(regionCode: string): Promise<Country[]> {
    return this.findMany({
      where: { regionCode },
      orderBy: { nameCommon: 'asc' },
    });
  }

  async getRandomCountries(count: number): Promise<Country[]> {
    const total = await this.count();
    const countries = await this.findMany({
      take: count,
      skip: Math.floor(Math.random() * Math.max(0, total - count)),
    });
    return countries;
  }
}
