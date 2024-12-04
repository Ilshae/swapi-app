import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly CACHE_TTL = 24 * 60 * 60;
  private readonly client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(
    key: string,
    value: any,
    ttl: number = this.CACHE_TTL,
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);
    await this.client.set(key, serializedValue, 'EX', ttl);
  }
}
