import { Module } from '@nestjs/common';
import { TelegramModule } from '@telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { configuration } from '@configuration/configuration';
import { TypedConfigModule } from 'nest-typed-config';
import {
  RootConfig,
  TelegramI18nConfig,
} from '@configuration/configuration.models';
import { DatabaseModule } from '@database/database.module';
import { LanguageModule } from '@language/language.module';
import {
  validateConfiguration,
  validateEnvironmentVariables,
} from '@configuration/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironmentVariables,
      isGlobal: true,
    }),
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: configuration,
      validate: validateConfiguration,
    }),
    I18nModule.forRootAsync({
      inject: [TelegramI18nConfig],
      useFactory: (telegramI18Config: TelegramI18nConfig) => ({
        fallbackLanguage: telegramI18Config.fallbackLanguage,
        loaderOptions: { path: telegramI18Config.i18nFolderPath },
        typesOutputPath: telegramI18Config.typesOutputPath,
      }),
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    TelegramModule,
    DatabaseModule,
    LanguageModule,
  ],
})
export class AppModule {}
