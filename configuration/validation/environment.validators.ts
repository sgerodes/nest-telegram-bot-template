import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class EnvironmentVariables {
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
