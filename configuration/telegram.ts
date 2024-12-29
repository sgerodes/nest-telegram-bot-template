import * as tg from 'telegraf/src/core/types/typegram';

export enum BotCommands {
    START = 'start',
}

export const CommandDescriptions: tg.BotCommand[] = [
    {
        command: '/' + BotCommands.START,
        description: 'Starts the bot',
    }
];
