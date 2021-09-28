import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/main/app.module';
import { setSwagger } from './swagger/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setSwagger(app);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
