import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Film {
  @Field()
  title: string;
  @Field()
  director: string;
  @Field()
  producer: string;
  @Field()
  release_date: string;
}

@ObjectType()
export class Species {
  @Field()
  name: string;
  @Field()
  classification: string;
  @Field()
  language: string;
}

@ObjectType()
export class Vehicle {
  @Field()
  name: string;
  @Field()
  model: string;
  @Field()
  manufacturer: string;
}

@ObjectType()
export class Starship {
  @Field()
  name: string;
  @Field()
  model: string;
  @Field()
  starship_class: string;
}

@ObjectType()
export class Planet {
  @Field()
  name: string;
  @Field()
  climate: string;
  @Field()
  terrain: string;
}
