import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {BotService} from "@telegram/bot.service";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                token: configService.get<string>('telegram.bot.token'),
            }),
        }),
    ],
    providers: [
        BotService,
    ]
})
export class TelegramModule {}
