import { Controller, Get } from '@nestjs/common';

@Controller()
export class SwapiController {
  @Get()
  getRoot(): string {
    return 'Welcome to the Star Wars API! Visit /graphql to interact with the API.';
  }
}
