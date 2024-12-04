import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';

import { SwapiService } from './swapi.service';

describe('SwapiService', () => {
  let service: SwapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule], // Import HttpModule here
      providers: [SwapiService],
    }).compile();

    service = module.get<SwapiService>(SwapiService);
  });

  it('should fetch films', async () => {
    const films = await service.fetchResource('films');
    expect(films).toBeDefined();
    expect(films.length).toBeGreaterThan(0);
  });
});
