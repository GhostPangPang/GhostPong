import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigService } from './config/app/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('GhostPong API')
    .setDescription('The GhostPong API description')
    .setVersion('1.0')
    .addTag('GhostPong')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const appConfig: AppConfigService = app.get(AppConfigService);
  await app.listen(appConfig.port);
}
bootstrap();
