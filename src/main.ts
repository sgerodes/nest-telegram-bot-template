import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

process.on('uncaughtException', (err) => {
  console.error('🔴 UncaughtException:', err.stack || err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('🔴 UnhandledRejection:', reason);
});

async function bootstrap() {
  const _app = await NestFactory.createApplicationContext(AppModule);
}
bootstrap();
