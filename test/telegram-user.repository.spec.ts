import { Test, TestingModule } from '@nestjs/testing';
import { TelegramUserRepository } from '@database/user-repository/telegram-user.repository';
import { PrismaService } from '@database/prisma.service';

describe('TelegramUserRepository', () => {
  let userRepository: TelegramUserRepository;
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
        TelegramUserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userRepository = module.get<TelegramUserRepository>(TelegramUserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    
    // Manually trigger onModuleInit since Nest doesn't call it in unit tests automatically
    userRepository.onModuleInit();
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should call findUnique on delegate when readByTelegramId is called', async () => {
    const telegramId = BigInt(123);
    mockPrismaService.telegramUser.findUnique.mockResolvedValue({ telegramId });

    const result = await userRepository.readByTelegramId(telegramId);

    expect(mockPrismaService.telegramUser.findUnique).toHaveBeenCalledWith({
      where: { telegramId },
    });
    expect(result).toEqual({ telegramId });
  });

  it('should call count on delegate when existsByTelegramId is called', async () => {
    const telegramId = BigInt(123);
    mockPrismaService.telegramUser.findFirst.mockResolvedValue({ telegramId });

    const result = await userRepository.existsByTelegramId(telegramId);

    expect(mockPrismaService.telegramUser.findFirst).toHaveBeenCalledWith({
      where: { telegramId },
    });
    expect(result).toBe(true);
  });
});
