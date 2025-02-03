import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
