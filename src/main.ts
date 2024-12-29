import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import {RootConfig} from "@configuration/validationAndInterfaces";

const logger = new Logger("main");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configuration = app.get(RootConfig);
  const port = configuration.application.port;

  logger.log(`Application starts on port ${port}`);
  await app.listen(port);
}
bootstrap();
