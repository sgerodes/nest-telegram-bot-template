import { Module } from '@nestjs/common';
import { UserRepositoryService } from './user-repository/user-repository.service';
import { PrismaService } from '@database/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [UserRepositoryService, PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
