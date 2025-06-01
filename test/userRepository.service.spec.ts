import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryService } from '@database/user-repository/user-repository.service';
import { PrismaService } from '@database/prisma.service';

describe('UserRepositoryService', () => {
  let userRepository: UserRepositoryService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    telegramUser: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepositoryService>(UserRepositoryService);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('readByTelegramId', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, telegramId: 123456, username: 'John Doe' };
      (prismaService.telegramUser.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.readByTelegramId(123456);
      expect(result).toEqual(mockUser);
      expect(prismaService.telegramUser.findUnique).toHaveBeenCalledWith({
        where: { telegramId: 123456 },
      });
    });

    it('should return null if no user is found', async () => {
      (prismaService.telegramUser.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.readByTelegramId(123456);
      expect(result).toBeNull();
      expect(prismaService.telegramUser.findUnique).toHaveBeenCalledWith({
        where: { telegramId: 123456 },
      });
    });
  });

  describe('existsByTelegramId', () => {
    it('should return true if the user exists', async () => {
      (prismaService.telegramUser.findFirst as jest.Mock).mockResolvedValue({
        telegramId: 123456,
      });

      const result = await userRepository.existsByTelegramId(123456);
      expect(result).toBe(true);
      expect(prismaService.telegramUser.findFirst).toHaveBeenCalledWith({
        where: { telegramId: 123456 },
      });
    });

    it('should return false if the user does not exist', async () => {
      (prismaService.telegramUser.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.existsByTelegramId(123456);
      expect(result).toBe(false);
      expect(prismaService.telegramUser.findFirst).toHaveBeenCalledWith({
        where: { telegramId: 123456 },
      });
    });
  });

  describe('createData', () => {
    it('should create a user and return the created user', async () => {
      const mockUserInput = { name: 'Jane Doe', telegramId: 654321 };
      const mockUser = { id: 2, ...mockUserInput };
      (prismaService.telegramUser.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.createData(mockUserInput);
      expect(result).toEqual(mockUser);
      expect(prismaService.telegramUser.create).toHaveBeenCalledWith({
        data: mockUserInput,
      });
    });
  });

  describe('readById', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, telegramId: 123456, username: 'John Doe' };
      (prismaService.telegramUser.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.readById(1);
      expect(result).toEqual(mockUser);
      expect(prismaService.telegramUser.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
