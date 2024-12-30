import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TypedConfigModule } from 'nest-typed-config';
import * as Joi from 'joi';
import { RootConfig } from '@configuration/configuration.models';

export const validateConfiguration = (
  config: Record<string, any>,
): RootConfig => {
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
  UPDATE_METADATA: Joi.boolean().optional(),
});
