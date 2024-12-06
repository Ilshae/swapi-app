import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { SwapiModule } from '../src/modules/swapi.module';
import { CacheService } from '../src/services/cache.service';

describe('App E2E Tests', () => {
  let app: INestApplication;
  let mockCacheService: Record<string, jest.Mock>;

  beforeAll(async () => {
    mockCacheService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SwapiModule],
    })
      .overrideProvider(CacheService)
      .useValue(mockCacheService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(
        'Welcome to the Star Wars API! Visit /graphql to interact with the API.',
      );
  });

  it('should fetch films via GraphQL', async () => {
    const query = `
      query {
        films {
          title
          director
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.data.films).toBeDefined();
    expect(response.body.data.films.length).toBeGreaterThan(0);
    expect(response.body.data.films[0]).toHaveProperty('title');
    expect(response.body.data.films[0]).toHaveProperty('director');
  });

  it('should fetch crawl analysis', async () => {
    const query = `
      query {
        openingCrawlAnalysis {
          wordCounts {
            word
            count
          }
          mostMentionedCharacters
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.data.openingCrawlAnalysis.wordCounts).toBeDefined();
    expect(
      response.body.data.openingCrawlAnalysis.mostMentionedCharacters,
    ).toBeDefined();
  });
});
