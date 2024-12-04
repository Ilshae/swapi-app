import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { SwapiService } from '../services/swapi.service';
import { SwapiResolver } from '../resolvers/swapi.resolver';
import { SwapiController } from '../controllers/swapi.controller';

@Module({
  imports: [
    HttpModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Specify Apollo as the driver
      autoSchemaFile: true, // Automatically generate schema file
      playground: true, // Enable GraphQL Playground
    }),
  ],
  providers: [SwapiService, SwapiResolver],
  controllers: [SwapiController],
})
export class SwapiModule {}
