import { Test, TestingModule } from '@nestjs/testing';

import { SwapiController } from './swapi.controller';
import { SwapiService } from '../services/swapi.service';

describe('SwapiController', () => {
  let controller: SwapiController;

  const mockSwapiService = {
    fetchResource: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapiController],
      providers: [{ provide: SwapiService, useValue: mockSwapiService }],
    }).compile();

    controller = module.get<SwapiController>(SwapiController);
  });

  it('should return word counts and most mentioned characters', async () => {
    mockSwapiService.fetchResource
      .mockResolvedValueOnce([
        { opening_crawl: 'A long time ago in a galaxy far, far away...' },
        {
          opening_crawl:
            'It is a period of civil war and Luke Skywalker is mentioned.',
        },
      ])
      .mockResolvedValueOnce([
        { name: 'Luke Skywalker' },
        { name: 'Leia Organa' },
      ])
      .mockResolvedValueOnce([{ name: 'Darth Vader' }])
      .mockResolvedValueOnce([]);

    const result = await controller.getOpeningCrawlWords();

    expect(result).toEqual({
      result: [
        {
          A: expect.arrayContaining([
            { word: 'a', count: 3 },
            { word: 'long', count: 1 },
            { word: 'time', count: 1 },
            { word: 'ago', count: 1 },
            { word: 'in', count: 1 },
            { word: 'galaxy', count: 1 },
            { word: 'far', count: 2 },
            { word: 'away', count: 1 },
            { word: 'it', count: 1 },
            { word: 'is', count: 2 },
            { word: 'period', count: 1 },
            { word: 'of', count: 1 },
            { word: 'civil', count: 1 },
            { word: 'war', count: 1 },
            { word: 'and', count: 1 },
            { word: 'luke', count: 1 },
            { word: 'skywalker', count: 1 },
            { word: 'mentioned', count: 1 },
          ]),
          B: ['Luke Skywalker'],
        },
      ],
    });
  });

  it('should handle empty films and people data', async () => {
    mockSwapiService.fetchResource
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const result = await controller.getOpeningCrawlWords();

    expect(result).toEqual({
      result: [{ A: [], B: [] }],
    });
  });

  it('should throw an error if fetching people fails', async () => {
    mockSwapiService.fetchResource.mockResolvedValueOnce([
      { opening_crawl: 'A long time ago in a galaxy far, far away...' },
    ]);

    mockSwapiService.fetchResource.mockRejectedValueOnce(
      new Error('Failed to fetch people'),
    );

    await expect(controller.getOpeningCrawlWords()).rejects.toThrow(
      'Error fetching people: Failed to fetch people',
    );
  });
});
