import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { RootConfig } from '@configuration/configuration.models';

const logger = new Logger('main');

async function bootstrap() {
  const _app = await NestFactory.createApplicationContext(AppModule);
}
bootstrap();
