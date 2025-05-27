import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function start() {
  const PORT = config.PORT;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  await app.listen(PORT, () => console.log('Server running on port', PORT));
}
start();