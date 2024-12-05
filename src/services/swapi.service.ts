import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { CacheService } from './cache.service';

@Injectable()
export class SwapiService {
  private readonly baseUrl = 'https://swapi.dev/api';
  private readonly logger = new Logger(SwapiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {}

  async fetchResource(
    resource: string,
    page = 1,
    filter?: string,
  ): Promise<any[]> {
    const cacheKey = `${resource}-page-${page}-${filter || 'all'}`;

    let cachedData: any[] | null = null;
    try {
      cachedData = await this.cacheService.get<any[]>(cacheKey);
    } catch (error) {
      this.logger.warn(
        `Cache get failed for key ${cacheKey}: ${error.message}`,
      );
    }

    if (cachedData) {
      return cachedData;
    }

    const url = `${this.baseUrl}/${resource}/?page=${page}`;
    const response = await firstValueFrom(this.httpService.get(url));
    let results = response.data.results;

    if (filter) {
      results = results.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(filter.toLowerCase()),
        ),
      );
    }

    try {
      await this.cacheService.set(cacheKey, results);
    } catch (error) {
      this.logger.warn(
        `Cache set failed for key ${cacheKey}: ${error.message}`,
      );
    }

    return results;
  }

  async fetchResourceById(resource: string, id: number): Promise<any> {
    const cacheKey = `${resource}-${id}`;
    const cachedData = await this.cacheService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const url = `${this.baseUrl}/${resource}/${id}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    await this.cacheService.set(cacheKey, data);

    return data;
  }
}
