import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const _app = await NestFactory.createApplicationContext(AppModule);
}
bootstrap();
