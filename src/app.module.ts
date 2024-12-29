import { Module } from '@nestjs/common';
import { TelegramModule } from '@telegram/telegram.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import {
  configuration,
  configurationValidationSchema,
} from '../configuration/configuration';
import {TypedConfigService} from "../configuration/typedConfig";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true, // Makes the ConfigService globally available
      load: [configuration],
      validationSchema: configurationValidationSchema,
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
  providers: [TypedConfigService], // Register TypedConfigService as a provider
  exports: [TypedConfigService],   // Export if needed in other modules
})
export class AppModule {}
