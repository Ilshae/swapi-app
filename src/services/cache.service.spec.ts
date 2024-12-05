import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SwapiService } from './swapi.service';
import { CacheService } from './cache.service';

describe('SwapiService with CacheService', () => {
  let service: SwapiService;

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        SwapiService,
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch films and cache them when cache is empty', async () => {
    mockCacheService.get.mockResolvedValue(null); // Simulate empty cache
    mockCacheService.set.mockResolvedValue(undefined);

    const films = await service.fetchResource('films');
    expect(films).toBeDefined();
    expect(mockCacheService.get).toHaveBeenCalledWith('films-page-1-all');
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'films-page-1-all',
      expect.any(Array),
    );
  });

  it('should return cached data if available', async () => {
    const cachedData = [{ title: 'A New Hope' }];
    mockCacheService.get.mockResolvedValue(cachedData);

    const films = await service.fetchResource('films');
    expect(films).toEqual(cachedData);
    expect(mockCacheService.get).toHaveBeenCalledWith('films-page-1-all');
    expect(mockCacheService.set).not.toHaveBeenCalled(); // Should not call set
  });

  it('should handle cache `get` failure and fetch from API', async () => {
    mockCacheService.get.mockRejectedValue(new Error('Redis down'));
    mockCacheService.set.mockResolvedValue(undefined);

    const films = await service.fetchResource('films');

    expect(films).toBeDefined();
    expect(mockCacheService.get).toHaveBeenCalledWith('films-page-1-all');
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'films-page-1-all',
      expect.any(Array),
    );
  });

  it('should handle cache `set` failure gracefully', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockRejectedValue(new Error('Redis down'));

    const films = await service.fetchResource('films');
    expect(films).toBeDefined();
    expect(mockCacheService.get).toHaveBeenCalledWith('films-page-1-all');
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'films-page-1-all',
      expect.any(Array),
    );
  });

  it('should handle both cache `get` and `set` failures gracefully', async () => {
    mockCacheService.get.mockRejectedValue(new Error('Redis down'));
    mockCacheService.set.mockRejectedValue(new Error('Redis down'));

    const films = await service.fetchResource('films');
    expect(films).toBeDefined();
    expect(mockCacheService.get).toHaveBeenCalledWith('films-page-1-all');
    expect(mockCacheService.set).toHaveBeenCalledWith(
      'films-page-1-all',
      expect.any(Array),
    );
  });
});
