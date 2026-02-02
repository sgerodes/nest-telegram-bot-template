import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';
import { PrismaService } from '@database/prisma.service';
import { createMockDelegate } from './db-test.utils';

describe('TelegramUserRepository', () => {
  let userRepository: TelegramUserRepository;
  let prismaService: PrismaService;

  const mockTelegramUser = {
    id: 1,
    telegramId: BigInt(123456789),
    username: 'test_user',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTelegramUserDelegate = createMockDelegate('TelegramUser');

  const mockPrismaService = {
    telegramUser: mockTelegramUserDelegate,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramUserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userRepository = module.get<TelegramUserRepository>(TelegramUserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    
    userRepository.onModuleInit();
    jest.clearAllMocks();
  });

  describe('Basic Discovery', () => {
    it('should be defined', () => {
      expect(userRepository).toBeDefined();
    });

    it('should have linked the correct delegate', () => {
      expect(userRepository.delegate).toBe(mockTelegramUserDelegate);
    });
  });

  describe('findByTelegramId', () => {
    it('should return a user when found by telegramId', async () => {
      mockTelegramUserDelegate.findUnique.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.findByTelegramId(mockTelegramUser.telegramId);

      expect(result).toEqual(mockTelegramUser);
      expect(mockTelegramUserDelegate.findUnique).toHaveBeenCalledWith({
        where: { telegramId: mockTelegramUser.telegramId },
      });
    });

    it('should return null when user is not found', async () => {
      mockTelegramUserDelegate.findUnique.mockResolvedValue(null);

      const result = await userRepository.findByTelegramId(BigInt(999));

      expect(result).toBeNull();
    });
  });

  describe('existsByTelegramId', () => {
    it('should return true if the user exists', async () => {
      mockTelegramUserDelegate.findFirst.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.existsByTelegramId(mockTelegramUser.telegramId);

      expect(result).toBe(true);
      expect(mockTelegramUserDelegate.findFirst).toHaveBeenCalledWith({
        where: { telegramId: mockTelegramUser.telegramId },
      });
    });

    it('should return false if the user does not exist', async () => {
      mockTelegramUserDelegate.findFirst.mockResolvedValue(null);

      const result = await userRepository.existsByTelegramId(BigInt(999));

      expect(result).toBe(false);
    });
  });

  describe('findById (Generic Base Method)', () => {
    it('should return a user by internal database ID', async () => {
      mockTelegramUserDelegate.findUnique.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.findById(1);

      expect(result).toEqual(mockTelegramUser);
      expect(mockTelegramUserDelegate.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('createData (Generic Base Method)', () => {
    it('should create a user with provided data', async () => {
      const inputData = {
        telegramId: BigInt(111),
        username: 'new_user',
      };
      mockTelegramUserDelegate.create.mockResolvedValue({ id: 2, ...inputData });

      const result = await userRepository.createData(inputData as any);

      expect(result).toMatchObject(inputData);
      expect(mockTelegramUserDelegate.create).toHaveBeenCalledWith({
        data: inputData,
      });
    });
  });

  describe('update (Generic Base Method)', () => {
    it('should update a user record', async () => {
      const updateArgs = {
        where: { id: 1 },
        data: { username: 'updated_name' },
      };
      mockTelegramUserDelegate.update.mockResolvedValue({ ...mockTelegramUser, username: 'updated_name' });

      const result = await userRepository.update(updateArgs);

      expect(result.username).toBe('updated_name');
      expect(mockTelegramUserDelegate.update).toHaveBeenCalledWith(updateArgs);
    });
  });

  describe('delete (Generic Base Method)', () => {
    it('should delete a user record', async () => {
      mockTelegramUserDelegate.delete.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.delete({ where: { id: 1 } });

      expect(result).toEqual(mockTelegramUser);
      expect(mockTelegramUserDelegate.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('Error Handling', () => {
    it('should propagate Prisma errors', async () => {
      const error = new Error('Database connection failed');
      mockTelegramUserDelegate.findUnique.mockRejectedValue(error);

      await expect(userRepository.findByTelegramId(BigInt(1)))
        .rejects.toThrow('Database connection failed');
    });
  });
});
