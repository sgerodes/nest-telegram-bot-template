import { applyDecorators } from '@nestjs/common';
import { IsInt, Max, ValidationOptions } from 'class-validator';

const TELEGRAM_MAX_ID: number = 2 ** 52; // at most 52 significant bits; https://core.telegram.org/bots/api#chat

export function IsTelegramId(validationOptions?: ValidationOptions) {
  return applyDecorators(
    IsInt(validationOptions),
    Max(TELEGRAM_MAX_ID, validationOptions),
  );
}
