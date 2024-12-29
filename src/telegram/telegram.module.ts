import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {BotUpdate} from "@telegram/bot.update";
import {TelegramConfig} from "@configuration/validationAndInterfaces";
import {DatabaseModule} from "@database/database.module";
import {UserRepositoryService} from "@database/user-repository/user-repository.service";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRootAsync({
            inject: [TelegramConfig],
            useFactory: (telegramConfig: TelegramConfig) => ({
                token: telegramConfig.bot.token,
            }),
        }),
        DatabaseModule,
    ],
    providers: [
        BotUpdate,
        UserRepositoryService
    ]
})
export class TelegramModule {}
