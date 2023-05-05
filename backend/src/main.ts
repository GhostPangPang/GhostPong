import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // validateCustomDecorators: true, // custom decorator 에 대한 validation 을 수행
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(Object.values(validationErrors[0]?.constraints || {})[0]);
      },
    }),
  );
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GhostPong API')
    .setDescription('The GhostPong API description')
    .setVersion('1.0')
    .addTag('GhostPong')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const appConfig: AppConfigService = app.get(AppConfigService);
  app.enableCors({
    origin: appConfig.clientUrl,
    credentials: true,
    allowedHeaders: ['Authorization', 'x-my-id'],
    exposedHeaders: ['Location'],
  });
  await app.listen(appConfig.port);
}
bootstrap();
