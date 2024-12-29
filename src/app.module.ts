import { Module } from '@nestjs/common';
import { TelegramModule } from '@telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import {
  configuration,
  configurationValidationSchema,
} from '../configuration/configuration';
// import {TypedConfigService} from "../configuration/typedConfig";
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import {RootConfig, validateConfiguration} from '../configuration/configurationSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true, // Makes the ConfigService globally available
      load: [configuration],
      validationSchema: configurationValidationSchema,
    }),
    TypedConfigModule.forRoot({
      schema: RootConfig,
      load: configuration, // Load configuration with defaults
      validate: validateConfiguration, // Validate against the schema
    }),


    I18nModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('telegram.i18n.fallbackLanguage'),
        loaderOptions: { path: configService.get('telegram.i18n.i18nFolderPath') },
      }),
      resolvers: [{
        use: QueryResolver, options: ['lang'],
      },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang'])],
    }),
    TelegramModule,
  ],
})
export class AppModule {}
