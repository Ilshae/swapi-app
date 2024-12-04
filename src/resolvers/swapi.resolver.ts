import { Resolver, Query, Args } from '@nestjs/graphql';
import { SwapiService } from '../services/swapi.service';
import { Film, Species, Vehicle, Starship, Planet } from '../graphql/models';

@Resolver()
export class SwapiResolver {
  constructor(private readonly swapiService: SwapiService) {}

  @Query(() => [Film])
  async films(@Args('page', { nullable: true }) page?: number, @Args('filter', { nullable: true }) filter?: string) {
    return this.swapiService.fetchResource('films', page, filter);
  }

  @Query(() => [Species])
  async species(@Args('page', { nullable: true }) page?: number, @Args('filter', { nullable: true }) filter?: string) {
    return this.swapiService.fetchResource('species', page, filter);
  }

  @Query(() => [Vehicle])
  async vehicles(@Args('page', { nullable: true }) page?: number, @Args('filter', { nullable: true }) filter?: string) {
    return this.swapiService.fetchResource('vehicles', page, filter);
  }

  @Query(() => [Starship])
  async starships(@Args('page', { nullable: true }) page?: number, @Args('filter', { nullable: true }) filter?: string) {
    return this.swapiService.fetchResource('starships', page, filter);
  }

  @Query(() => [Planet])
  async planets(@Args('page', { nullable: true }) page?: number, @Args('filter', { nullable: true }) filter?: string) {
    return this.swapiService.fetchResource('planets', page, filter);
  }
}
