import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';
import { PrismaService } from '@database/prisma.service';

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

  const mockPrismaService = {
    telegramUser: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      $modelName: 'TelegramUser',
    },
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
      expect(userRepository.delegate).toBe(mockPrismaService.telegramUser);
    });
  });

  describe('readByTelegramId', () => {
    it('should return a user when found by telegramId', async () => {
      mockPrismaService.telegramUser.findUnique.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.readByTelegramId(mockTelegramUser.telegramId);

      expect(result).toEqual(mockTelegramUser);
      expect(mockPrismaService.telegramUser.findUnique).toHaveBeenCalledWith({
        where: { telegramId: mockTelegramUser.telegramId },
      });
    });

    it('should return null when user is not found', async () => {
      mockPrismaService.telegramUser.findUnique.mockResolvedValue(null);

      const result = await userRepository.readByTelegramId(BigInt(999));

      expect(result).toBeNull();
    });
  });

  describe('existsByTelegramId', () => {
    it('should return true if the user exists', async () => {
      mockPrismaService.telegramUser.findFirst.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.existsByTelegramId(mockTelegramUser.telegramId);

      expect(result).toBe(true);
      expect(mockPrismaService.telegramUser.findFirst).toHaveBeenCalledWith({
        where: { telegramId: mockTelegramUser.telegramId },
      });
    });

    it('should return false if the user does not exist', async () => {
      mockPrismaService.telegramUser.findFirst.mockResolvedValue(null);

      const result = await userRepository.existsByTelegramId(BigInt(999));

      expect(result).toBe(false);
    });
  });

  describe('readById (Generic Base Method)', () => {
    it('should return a user by internal database ID', async () => {
      mockPrismaService.telegramUser.findUnique.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.readById(1);

      expect(result).toEqual(mockTelegramUser);
      expect(mockPrismaService.telegramUser.findUnique).toHaveBeenCalledWith({
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
      mockPrismaService.telegramUser.create.mockResolvedValue({ id: 2, ...inputData });

      const result = await userRepository.createData(inputData as any);

      expect(result).toMatchObject(inputData);
      expect(mockPrismaService.telegramUser.create).toHaveBeenCalledWith({
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
      mockPrismaService.telegramUser.update.mockResolvedValue({ ...mockTelegramUser, username: 'updated_name' });

      const result = await userRepository.update(updateArgs);

      expect(result.username).toBe('updated_name');
      expect(mockPrismaService.telegramUser.update).toHaveBeenCalledWith(updateArgs);
    });
  });

  describe('delete (Generic Base Method)', () => {
    it('should delete a user record', async () => {
      mockPrismaService.telegramUser.delete.mockResolvedValue(mockTelegramUser);

      const result = await userRepository.delete({ where: { id: 1 } });

      expect(result).toEqual(mockTelegramUser);
      expect(mockPrismaService.telegramUser.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('Error Handling', () => {
    it('should propagate Prisma errors', async () => {
      const error = new Error('Database connection failed');
      mockPrismaService.telegramUser.findUnique.mockRejectedValue(error);

      await expect(userRepository.readByTelegramId(BigInt(1)))
        .rejects.toThrow('Database connection failed');
    });
  });
});
