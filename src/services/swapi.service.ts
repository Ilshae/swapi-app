import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SwapiService {
  private readonly baseUrl = 'https://swapi.dev/api';

  constructor(private readonly httpService: HttpService) {}

  async fetchResource(resource: string, page = 1, filter?: string): Promise<any[]> {
    const url = `${this.baseUrl}/${resource}/?page=${page}`;
    const response = await firstValueFrom(this.httpService.get(url));
    let results = response.data.results;

    if (filter) {
      results = results.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    return results;
  }
}
