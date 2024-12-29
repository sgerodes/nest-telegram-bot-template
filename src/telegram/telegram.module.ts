import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {BotUpdate} from "@telegram/bot.update";
import {TelegramConfig} from "@configuration/validationAndInterfaces";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRootAsync({
            inject: [TelegramConfig],
            useFactory: (telegramConfig: TelegramConfig) => ({
                token: telegramConfig.bot.token,
            }),
        }),
    ],
    providers: [
        BotUpdate,
    ]
})
export class TelegramModule {}
