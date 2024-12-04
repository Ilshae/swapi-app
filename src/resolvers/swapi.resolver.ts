import { Args, Query, Resolver } from '@nestjs/graphql';

import { SwapiService } from '../services/swapi.service';
import { Film, Species, Vehicle, Starship, Planet } from '../graphql/models';

@Resolver()
export class SwapiResolver {
  constructor(private readonly swapiService: SwapiService) {}

  @Query(() => [Film])
  async films(
    @Args('page', { nullable: true }) page?: number,
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<Film[]> {
    return this.swapiService.fetchResource('films', page, filter);
  }

  @Query(() => Film)
  async film(@Args('id') id: number): Promise<Film> {
    return this.swapiService.fetchResourceById('films', id);
  }

  @Query(() => [Species])
  async species(
    @Args('page', { nullable: true }) page?: number,
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<Species[]> {
    return this.swapiService.fetchResource('species', page, filter);
  }

  @Query(() => Species)
  async speciesById(@Args('id') id: number): Promise<Species> {
    return this.swapiService.fetchResourceById('species', id);
  }

  @Query(() => [Vehicle])
  async vehicles(
    @Args('page', { nullable: true }) page?: number,
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<Vehicle[]> {
    return this.swapiService.fetchResource('vehicles', page, filter);
  }

  @Query(() => Vehicle)
  async vehicle(@Args('id') id: number): Promise<Vehicle> {
    return this.swapiService.fetchResourceById('vehicles', id);
  }

  @Query(() => [Starship])
  async starships(
    @Args('page', { nullable: true }) page?: number,
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<Starship[]> {
    return this.swapiService.fetchResource('starships', page, filter);
  }

  @Query(() => Starship)
  async starship(@Args('id') id: number): Promise<Starship> {
    return this.swapiService.fetchResourceById('starships', id);
  }

  @Query(() => [Planet])
  async planets(
    @Args('page', { nullable: true }) page?: number,
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<Planet[]> {
    return this.swapiService.fetchResource('planets', page, filter);
  }

  @Query(() => Planet)
  async planet(@Args('id') id: number): Promise<Planet> {
    return this.swapiService.fetchResourceById('planets', id);
  }
}
