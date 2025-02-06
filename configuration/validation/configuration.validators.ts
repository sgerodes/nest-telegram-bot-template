import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

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

  @IsObject()
  @IsOptional()
  fallbacks!: Record<string, string>;

  @IsBoolean()
  logging: boolean;

  @IsString()
  i18nFolderPath!: string;

  @IsString()
  typesOutputPath!: string;

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
  @Type(() => TelegramConfig)
  @ValidateNested()
  telegram!: TelegramConfig;

  @Type(() => DatabaseConfig)
  @ValidateNested()
  database!: DatabaseConfig;
}
