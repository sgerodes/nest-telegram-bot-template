import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUserRepositoryV2Service } from '@database/user-repository/user-repository.v2.service';
import { PrismaService } from '@database/prisma.service';

describe('TelegramUserRepositoryV2Service', () => {
  let userRepository: TelegramUserRepositoryV2Service;
  let prismaService: PrismaService;

  const mockPrismaService = {
    telegramUser: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      $modelName: 'TelegramUser', // Mocking the injected metadata
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramUserRepositoryV2Service,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userRepository = module.get<TelegramUserRepositoryV2Service>(TelegramUserRepositoryV2Service);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Manually trigger onModuleInit for discovery in tests
    await userRepository.onModuleInit();
    
    jest.clearAllMocks();
  });

  describe('readByTelegramId', () => {
    it('should return a user if found', async () => {
      const mockUser = { id: 1, telegramId: 123456n, username: 'John Doe' };
      (prismaService.telegramUser.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.readByTelegramId(123456n);
      expect(result).toEqual(mockUser);
      expect(prismaService.telegramUser.findUnique).toHaveBeenCalledWith({
        where: { telegramId: 123456n },
      });
    });
  });

  describe('existsByTelegramId', () => {
    it('should return true if the user exists', async () => {
      (prismaService.telegramUser.findFirst as jest.Mock).mockResolvedValue({
        telegramId: 123456n,
      });

      const result = await userRepository.existsByTelegramId(123456n);
      expect(result).toBe(true);
      expect(prismaService.telegramUser.findFirst).toHaveBeenCalledWith({
        where: { telegramId: 123456n },
      });
    });
  });

  describe('createData', () => {
    it('should create a user and return the created user', async () => {
      const mockUserInput = { firstName: 'Jane', telegramId: 654321n };
      const mockUser = { id: 2, ...mockUserInput };
      (prismaService.telegramUser.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.createData(mockUserInput as any);
      expect(result).toEqual(mockUser);
      expect(prismaService.telegramUser.create).toHaveBeenCalledWith({
        data: mockUserInput,
      });
    });
  });
});

