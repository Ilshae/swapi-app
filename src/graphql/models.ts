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

@ObjectType()
export class OpeningCrawlAnalysis {
  @Field(() => [WordCount], {
    description: 'List of unique words and their counts',
  })
  wordCounts: WordCount[];

  @Field(() => [String], { description: 'Most mentioned character names' })
  mostMentionedCharacters: string[];
}

@ObjectType()
export class WordCount {
  @Field()
  word: string;

  @Field()
  count: number;
}
