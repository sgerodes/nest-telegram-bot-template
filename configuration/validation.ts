import { plainToClass, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TypedConfigModule } from 'nest-typed-config';
import {
  EnvironmentVariables,
  RootConfig,
} from '@configuration/configuration.models';

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

export function validateEnvironmentVariables(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
