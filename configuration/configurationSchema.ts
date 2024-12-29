import {
    IsString,
    IsNumber,
    IsNotEmpty,
    IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Allow, ValidateNested } from 'class-validator';
import {TypedConfigModule} from "nest-typed-config";

export class ApplicationConfig {
    @IsNumber()
    @IsOptional()
    port: number;
}


export class TelegramBotConfig {
    @IsString()
    @IsNotEmpty()
    token!: string;
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

export class RootConfig {
    @Type(() => ApplicationConfig)
    @ValidateNested()
    application!: ApplicationConfig;

    @Type(() => TelegramConfig)
    @ValidateNested()
    telegram!: TelegramConfig;
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