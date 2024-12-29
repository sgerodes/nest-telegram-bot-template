import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {BotService} from "@telegram/bot.service";
import {TelegramConfig} from "@configuration/configurationSchema";


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
        BotService,
    ]
})
export class TelegramModule {}
