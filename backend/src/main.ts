import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validation pipe 를 global 으로 사용.
  // (transform: true 는 DTO 에서 @IsNumber() 를 사용할 때, string 을 number 로 자동 변환해줌)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      // validateCustomDecorators: true, // custom decorator 에 대한 validation 을 수행
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
  await app.listen(appConfig.appPort);
}
bootstrap();
