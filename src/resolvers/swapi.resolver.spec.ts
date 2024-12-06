import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { SwapiResolver } from './swapi.resolver';
import { SwapiService } from '../services/swapi.service';

describe('OpeningCrawlAnalysis', () => {
  let app: INestApplication; // Declare the `app` variable

  const mockSwapiService = {
    fetchResource: jest.fn(),
    fetchResourceById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        SwapiResolver,
        { provide: SwapiService, useValue: mockSwapiService },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return word counts and most mentioned characters', async () => {
    mockSwapiService.fetchResource.mockResolvedValueOnce([
      {
        opening_crawl: 'A long time ago in a galaxy far, far away...',
      },
      {
        opening_crawl:
          'It is a period of civil war, and Luke Skywalker is mentioned.',
      },
    ]);
    mockSwapiService.fetchResource.mockResolvedValueOnce([
      { name: 'Luke Skywalker' },
      { name: 'Leia Organa' },
    ]);

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

    const { wordCounts, mostMentionedCharacters } =
      response.body.data.openingCrawlAnalysis;

    expect(wordCounts).toContainEqual({ word: 'a', count: 3 });
    expect(wordCounts).toContainEqual({ word: 'galaxy', count: 1 });
    expect(mostMentionedCharacters).toEqual(['Luke Skywalker']);
  });

  it('should fetch all films', async () => {
    mockSwapiService.fetchResource.mockResolvedValueOnce([
      {
        title: 'A New Hope',
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
      },
      {
        title: 'The Empire Strikes Back',
        director: 'Irvin Kershner',
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1980-05-17',
      },
    ]);

    const query = `
      query {
        films {
          title
          director
          producer
          release_date
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    const films = response.body.data.films;

    expect(films).toBeDefined();
    expect(films.length).toBe(2);
    expect(films).toContainEqual({
      title: 'A New Hope',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
    });
    expect(films).toContainEqual({
      title: 'The Empire Strikes Back',
      director: 'Irvin Kershner',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1980-05-17',
    });
  });

  it('should handle empty films and people data gracefully', async () => {
    mockSwapiService.fetchResource.mockResolvedValueOnce([]); // No films
    mockSwapiService.fetchResource.mockResolvedValueOnce([]); // No people

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

    const { wordCounts, mostMentionedCharacters } =
      response.body.data.openingCrawlAnalysis;

    expect(wordCounts).toEqual([]);
    expect(mostMentionedCharacters).toEqual([]);
  });

  it('should throw an error if fetching people fails', async () => {
    mockSwapiService.fetchResource.mockResolvedValueOnce([
      {
        opening_crawl: 'A long time ago in a galaxy far, far away...',
      },
    ]);

    mockSwapiService.fetchResource.mockRejectedValueOnce(
      new Error('Failed to fetch people'),
    );

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
      .send({ query });

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toContain(
      'Error fetching people: Failed to fetch people',
    );
  });
});
