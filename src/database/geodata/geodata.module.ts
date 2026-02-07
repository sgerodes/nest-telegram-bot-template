import { Module } from '@nestjs/common';
import { GeodataPrismaService } from './geodata-prisma.service';
import { CountryRepository } from './country.repository';
import { CityRepository } from './city.repository';

@Module({
  providers: [GeodataPrismaService, CountryRepository, CityRepository],
  exports: [GeodataPrismaService, CountryRepository, CityRepository],
})
export class GeodataModule {}
