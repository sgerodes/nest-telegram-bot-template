import { applyDecorators } from '@nestjs/common';
import { IsInt, Max, ValidationOptions } from 'class-validator';
import { registerDecorator, ValidationArguments, IsString } from 'class-validator';

const TELEGRAM_MAX_ID: number = 2 ** 52; // at most 52 significant bits; https://core.telegram.org/bots/api#chat

export function IsTelegramId(validationOptions?: ValidationOptions) {
  return applyDecorators(
    IsInt(validationOptions),
    Max(TELEGRAM_MAX_ID, validationOptions),
  );
}

export function IsTimeString(validationOptions?: ValidationOptions) {
  return applyDecorators(
    IsString(validationOptions),
    function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isTimeString',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, _args: ValidationArguments) {
            return typeof value === 'string' && /^\d{2}:\d{2}$/.test(value);
          },
          defaultMessage(args: ValidationArguments) {
            return `${args.property} must be a valid time string in HH:mm format`;
          },
        },
      });
    }
  );
}