import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'coverage/lcov-report'));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running at ${await app.getUrl()}`);
}
bootstrap();
