## Description

This API provides access to Star Wars resources using GraphQL. 
The available endpoints allow querying for films, 
species, vehicles, starships, planets, and an analysis of film opening crawls.

## Base URL
The GraphQL API can be accessed at: 
```
http://<host>:<port>/graphql
```

## GraphQL Endpoints Documentation

You can generate the comprehensive API documentation using the following command:
```
npm run docs:generate
```
This will generate detailed documentation of all available GraphQL queries and their respective schemas.


### Available GraphQL Queries
The application provides the following GraphQL queries for accessing 
and analyzing resources from the Star Wars universe.

#### Fetch all resources
Use these queries to retrieve all instances of a resource, with support for optional pagination and filtering:
- films
- species
- vehicles
- starships
- planets

#### Fetch resources by ID:
Use these queries to retrieve a specific resource by its unique ID:
- film
- speciesById
- vehicle
- starship
- planet

#### Opening Crawl Analysis Query
This query performs an analysis of the opening crawls from all Star Wars films. It provides two key insights:
- word Counts: An array of unique words found in the opening crawls, paired with their respective frequencies.
- most Mentioned Characters: The names of the characters mentioned most frequently in the opening crawls.

## Usage
For interacting with the API, use the GraphQL Playground available at:
http://localhost:3000/graphql

Refer to the generated documentation in the docs folder for detailed schemas and usage examples.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```