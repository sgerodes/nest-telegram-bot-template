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

export const TELEGRAM_BTN_ACTIONS = {
    CLOSE: 'id_0_close',
};

export const SCENES = {
    START: 'startScene',
};