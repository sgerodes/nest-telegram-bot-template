import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  Max,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsTelegramId } from '@configuration/validation/utils';

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

export class TelegramIdsConfig {
  @IsTelegramId()
  playgroundChannelId!: number;

  @IsTelegramId()
  playgroundGroupId!: number;

  @IsTelegramId()
  ownerTelegramId!: number;

  @IsArray()
  @IsTelegramId({ each: true })
  adminTelegramIds!: number[];
}

export class QuizConfig {
  @IsString()
  quizQuestionDirectory!: string;
}

export class TelegramConfig {
  @Type(() => TelegramBotConfig)
  @ValidateNested()
  bot!: TelegramBotConfig;

  @Type(() => TelegramI18nConfig)
  @ValidateNested()
  i18n!: TelegramI18nConfig;

  @Type(() => TelegramIdsConfig)
  @ValidateNested()
  telegramIds!: TelegramIdsConfig;

  @Type(() => QuizConfig)
  @ValidateNested()
  quiz: QuizConfig;
}

export class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  url!: string;
}

export class TonConfig {
  @IsString()
  @IsNotEmpty()
  paymentAddress!: string;
}

export class RootConfig {
  @Type(() => TelegramConfig)
  @ValidateNested()
  telegram!: TelegramConfig;

  @Type(() => DatabaseConfig)
  @ValidateNested()
  database!: DatabaseConfig;

  @Type(() => TonConfig)
  @ValidateNested()
  ton!: TonConfig;
}
