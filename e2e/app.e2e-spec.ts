import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { SwapiModule } from '../src/modules/swapi.module';

describe('App E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SwapiModule],
    }).compile();

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
        'Welcome to the Star Wars API! Visit /graphql to interact with the API. \n' +
          'In order to access crawl analysis go to: http://localhost:3000/opening-crawl-analysis',
      );
  });

  it('/opening-crawl-analysis (GET)', async () => {
    jest.setTimeout(15000);

    const response = await request(app.getHttpServer())
      .get('/opening-crawl-analysis')
      .expect(200);

    expect(response.body).toHaveProperty('result');
    expect(response.body.result[0]).toHaveProperty('A');
    expect(response.body.result[0]).toHaveProperty('B');
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
});
