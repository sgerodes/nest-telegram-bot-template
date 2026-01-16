import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TOKEN: string;

  @IsString()
  @IsOptional()
  TELEGRAM_WEBAPP_URL?: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsBoolean()
  @IsOptional()
  UPDATE_METADATA?: boolean;
}
