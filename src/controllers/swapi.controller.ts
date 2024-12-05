import { Controller, Get } from '@nestjs/common';

import { SwapiService } from '../services/swapi.service';

@Controller()
export class SwapiController {
  constructor(private readonly swapiService: SwapiService) {}

  @Get()
  getRoot(): string {
    return (
      'Welcome to the Star Wars API! Visit /graphql to interact with the API. \n' +
      'In order to access crawl analysis go to: http://localhost:3000/opening-crawl-analysis'
    );
  }

  @Get('opening-crawl-analysis')
  async getOpeningCrawlWords(): Promise<OpeningCrawlAnalysisResult> {
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

    return { result: [{ A: wordCounts, B: mostMentionedCharacters }] };
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

interface OpeningCrawlAnalysisResult {
  result: Array<{
    A: { word: string; count: number }[];
    B: string[];
  }>;
}
