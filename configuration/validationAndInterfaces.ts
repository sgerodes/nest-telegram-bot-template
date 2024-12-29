import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Allow, ValidateNested } from 'class-validator';
import {TypedConfigModule} from "nest-typed-config";
import * as Joi from "joi";


export class ApplicationConfig {
    @IsNumber()
    @IsOptional()
    port: number;
}

export class TelegramBotConfig {
    @IsString()
    @IsNotEmpty()
    token!: string;

    // @IsString()
    // @IsNotEmpty()
    // @MaxLength(64)
    // displayName!: string;
    //
    // @IsString()
    // @IsNotEmpty()
    // @MaxLength(120)
    // shortDescription!: string;
    //
    // @IsString()
    // @IsNotEmpty()
    // @MaxLength(512)
    // description!: string;
}

export class TelegramI18nConfig {
    @IsString()
    fallbackLanguage!: string;

    @IsString()
    i18nFolderPath!: string;
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


export const validateConfiguration = (config: Record<string, any>): RootConfig => {
    const configInstance = plainToInstance(RootConfig, config);
    const validationErrors = validateSync(configInstance, {
        whitelist: true,
        forbidUnknownValues: true,
    });

    if (validationErrors.length) {
        throw new Error(TypedConfigModule.getConfigErrorMessage(validationErrors));
    }

    return configInstance;
};


export const environmentValidationSchema = Joi.object({
    PORT: Joi.number().integer().min(1).max(65535).optional(),
    TELEGRAM_BOT_TOKEN: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
});
