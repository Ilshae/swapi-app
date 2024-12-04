import { NestFactory } from '@nestjs/core';

import { SwapiModule } from './modules/swapi.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SwapiModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
