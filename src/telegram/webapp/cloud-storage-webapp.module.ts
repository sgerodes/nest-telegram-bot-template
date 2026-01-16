import { Module } from '@nestjs/common';
import { CloudStorageWebAppController } from '@telegram/webapp/cloud-storage-webapp.controller';

@Module({
  controllers: [CloudStorageWebAppController],
})
export class CloudStorageWebAppModule {}
