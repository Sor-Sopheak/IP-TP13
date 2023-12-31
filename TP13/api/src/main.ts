import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

bootstrap();

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  { cors: true });

  app.use(cookieParser());
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb'}));

  app.use(
    session({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: true,
      name: 'token'
    }),
  );
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableCors();
  await app.listen(3000);

}


