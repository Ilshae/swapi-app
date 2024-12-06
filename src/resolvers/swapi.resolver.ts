import { Args, Query, Resolver } from '@nestjs/graphql';

import { SwapiService } from '../services/swapi.service';
import {
  Film,
  Species,
  Vehicle,
  Starship,
  Planet,
  OpeningCrawlAnalysis,
} from '../graphql/models';

@Resolver()
export class SwapiResolver {
  constructor(private readonly swapiService: SwapiService) {}

  @Query(() => [Film], {
    description: 'Retrieve all films with optional pagination and filtering',
  })
  async films(
    @Args('page', { nullable: true, description: 'Page number for pagination' })
    page?: number,
    @Args('filter', { nullable: true, description: 'Keyword to filter films' })
    filter?: string,
  ): Promise<Film[]> {
    return this.swapiService.fetchResource('films', page, filter);
  }

  @Query(() => Film, { description: 'Retrieve a single film by its ID' })
  async film(
    @Args('id', { description: 'ID of the film to retrieve' }) id: number,
  ): Promise<Film> {
    return this.swapiService.fetchResourceById('films', id);
  }

  @Query(() => [Species], {
    description: 'Retrieve all species with optional pagination and filtering',
  })
  async species(
    @Args('page', { nullable: true, description: 'Page number for pagination' })
    page?: number,
    @Args('filter', {
      nullable: true,
      description: 'Keyword to filter species',
    })
    filter?: string,
  ): Promise<Species[]> {
    return this.swapiService.fetchResource('species', page, filter);
  }

  @Query(() => Species, { description: 'Retrieve a single species by its ID' })
  async speciesById(
    @Args('id', { description: 'ID of the species to retrieve' }) id: number,
  ): Promise<Species> {
    return this.swapiService.fetchResourceById('species', id);
  }

  @Query(() => [Vehicle], {
    description: 'Retrieve all vehicles with optional pagination and filtering',
  })
  async vehicles(
    @Args('page', { nullable: true, description: 'Page number for pagination' })
    page?: number,
    @Args('filter', {
      nullable: true,
      description: 'Keyword to filter vehicles',
    })
    filter?: string,
  ): Promise<Vehicle[]> {
    return this.swapiService.fetchResource('vehicles', page, filter);
  }

  @Query(() => Vehicle, { description: 'Retrieve a single vehicle by its ID' })
  async vehicle(
    @Args('id', { description: 'ID of the vehicle to retrieve' }) id: number,
  ): Promise<Vehicle> {
    return this.swapiService.fetchResourceById('vehicles', id);
  }

  @Query(() => [Starship], {
    description:
      'Retrieve all starships with optional pagination and filtering',
  })
  async starships(
    @Args('page', { nullable: true, description: 'Page number for pagination' })
    page?: number,
    @Args('filter', {
      nullable: true,
      description: 'Keyword to filter starships',
    })
    filter?: string,
  ): Promise<Starship[]> {
    return this.swapiService.fetchResource('starships', page, filter);
  }

  @Query(() => Starship, {
    description: 'Retrieve a single starship by its ID',
  })
  async starship(
    @Args('id', { description: 'ID of the starship to retrieve' }) id: number,
  ): Promise<Starship> {
    return this.swapiService.fetchResourceById('starships', id);
  }

  @Query(() => [Planet], {
    description: 'Retrieve all planets with optional pagination and filtering',
  })
  async planets(
    @Args('page', { nullable: true, description: 'Page number for pagination' })
    page?: number,
    @Args('filter', {
      nullable: true,
      description: 'Keyword to filter planets',
    })
    filter?: string,
  ): Promise<Planet[]> {
    return this.swapiService.fetchResource('planets', page, filter);
  }

  @Query(() => Planet, { description: 'Retrieve a single planet by its ID' })
  async planet(
    @Args('id', { description: 'ID of the planet to retrieve' }) id: number,
  ): Promise<Planet> {
    return this.swapiService.fetchResourceById('planets', id);
  }

  @Query(() => OpeningCrawlAnalysis, { description: 'Analyze opening crawls' })
  async openingCrawlAnalysis(): Promise<OpeningCrawlAnalysis> {
    const films = await this.swapiService.fetchResource('films');
    const filmsOpeningCrawl = films.map((film) => film.opening_crawl).join(' ');

    // A: Count unique words in opening crawls
    const wordCounts = this.countUniqueWords(filmsOpeningCrawl);

    const people = await this.fetchAllPeople();

    // B: Find the most frequently mentioned character
    const mostMentionedCharacters = this.findMostMentionedCharacters(
      filmsOpeningCrawl,
      people.map((person) => person.name),
    );

    return { wordCounts, mostMentionedCharacters };
  }

  private countUniqueWords(text: string): { word: string; count: number }[] {
    const words = text
      .toLowerCase()
      .replace(/[\r\n\t]+/g, ' ') // Replace control characters with space
      .replace(/[^a-z0-9\s]/gi, '') // Remove special characters
      .split(/\s+/) // Split by spaces
      .filter((word) => word.length > 0); // Filter out empty words

    const wordCounts = new Map<string, number>();
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }

    return Array.from(wordCounts.entries()).map(([word, count]) => ({
      word,
      count,
    }));
  }

  private async fetchAllPeople(): Promise<any[]> {
    const people = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const currentPage = await this.swapiService.fetchResource(
          'people',
          page,
        );

        if (!currentPage || currentPage.length === 0) {
          hasMorePages = false; // Stop if no data is returned
        } else {
          people.push(...currentPage);
          page++;
        }
      } catch (err) {
        if (err.response?.status === 404) {
          hasMorePages = false; // Stop on 404
        } else {
          throw new Error(`Error fetching people: ${err.message}`);
        }
      }
    }

    return people;
  }

  private findMostMentionedCharacters(
    text: string,
    characterNames: string[],
  ): string[] {
    const nameCounts = new Map<string, number>();
    const normalizedText = text
      .toLowerCase()
      .replace(/[\r\n\t]+/g, ' ') // Replace control characters with spaces
      .replace(/[^a-z0-9\s]/gi, ''); // Remove special characters

    for (const name of characterNames) {
      const regex = new RegExp(`\\b${name.toLowerCase()}\\b`, 'g');
      const count = (normalizedText.match(regex) || []).length;

      if (count > 0) {
        nameCounts.set(name, count);
      }
    }

    const maxCount = Math.max(...nameCounts.values());

    return Array.from(nameCounts.entries())
      .filter(([_, count]) => count === maxCount)
      .map(([name]) => name);
  }
}
