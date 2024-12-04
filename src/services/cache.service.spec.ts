import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SwapiService } from './swapi.service';
import { CacheService } from './cache.service';

describe('SwapiService', () => {
  let service: SwapiService;

  const mockCacheService = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
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

  it('should fetch films', async () => {
    const films = await service.fetchResource('films');
    expect(films).toBeDefined();
    expect(mockCacheService.get).toHaveBeenCalledWith('films-page-1-all');
    expect(mockCacheService.set).toHaveBeenCalled();
  });
});
