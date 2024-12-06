import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly CACHE_TTL = 24 * 60 * 60; // Default TTL: 24 hours
  private readonly client: Redis;
  private readonly logger = new Logger(CacheService.name);

  constructor() {
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT, 10) || 6379;
    const redisPassword = process.env.REDIS_PASSWORD || undefined;

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      reconnectOnError: (err) => {
        this.logger.error('Redis connection error:', err);
        return true;
      },
    });
  }

  async onModuleInit() {
    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis error:', error);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Disconnected from Redis');
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(
        `Failed to get cache for key "${key}": ${error.message}`,
      );
      return null;
    }
  }

  async set(
    key: string,
    value: any,
    ttl: number = this.CACHE_TTL,
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.set(key, serializedValue, 'EX', ttl);
    } catch (error) {
      this.logger.error(
        `Failed to set cache for key "${key}": ${error.message}`,
      );
    }
  }
}
