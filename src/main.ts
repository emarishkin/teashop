import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.enableCors({
    origin: process.env.CLIENT_URL ? new RegExp(process.env.CLIENT_URL) : undefined,
    credentials:true,
    exposedHeaders:'set-cookie'
  })
  await app.listen(5000);
}
bootstrap();
