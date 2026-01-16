import { AbstractRepositoryV3 } from '@database/abstract.repository.v3';

/**
 * A type that maps all delegate methods to jest.Mock
 */
export type MockDelegate = {
  [K in keyof AbstractRepositoryV3<any>['delegate']]: jest.Mock;
} & { $modelName: string };

/**
 * A factory to create a mock delegate with all required methods automatically.
 * This ensures the mock inherits the interface of the repository delegate.
 * 
 * @param modelName The Prisma model name (e.g., 'TelegramUser')
 */
export const createMockDelegate = (modelName: string): MockDelegate => ({
  create: jest.fn(),
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  $modelName: modelName,
});
