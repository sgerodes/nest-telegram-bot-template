import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TOKEN: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsBoolean()
  @IsOptional()
  UPDATE_METADATA?: boolean;
}

export class ApplicationConfig {
  @IsNumber()
  @IsOptional()
  port: number;
}

export class TelegramBotConfig {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsBoolean()
  @IsOptional()
  updateMetadata: boolean;
}

export class TelegramI18nConfig {
  @IsString()
  fallbackLanguage!: string;

  @IsString()
  i18nFolderPath!: string;

  @IsArray()
  @IsString({ each: true })
  enabledLanguages: string[];
}

export class TelegramConfig {
  @Type(() => TelegramBotConfig)
  @ValidateNested()
  bot!: TelegramBotConfig;

  @Type(() => TelegramI18nConfig)
  @ValidateNested()
  i18n!: TelegramI18nConfig;
}

export class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  url!: string;
}

export class RootConfig {
  @Type(() => ApplicationConfig)
  @ValidateNested()
  application!: ApplicationConfig;

  @Type(() => TelegramConfig)
  @ValidateNested()
  telegram!: TelegramConfig;

  @Type(() => DatabaseConfig)
  @ValidateNested()
  database!: DatabaseConfig;
}
