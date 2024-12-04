import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { RedisModule } from '@nestjs-modules/ioredis';

import { SwapiService } from '../services/swapi.service';
import { SwapiResolver } from '../resolvers/swapi.resolver';
import { SwapiController } from '../controllers/swapi.controller';
import { CacheService } from '../services/cache.service';

@Module({
  imports: [
    HttpModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Specify Apollo as the driver
      autoSchemaFile: true, // Automatically generate schema file
      playground: true, // Enable GraphQL Playground
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  providers: [SwapiService, SwapiResolver, CacheService],
  controllers: [SwapiController],
})
export class SwapiModule {}
