import { Args, Query, Resolver } from '@nestjs/graphql';

import { SwapiService } from '../services/swapi.service';
import { Film, Species, Vehicle, Starship, Planet } from '../graphql/models';

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
}
