import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigModule } from './config/database/configuration.module';
import { DatabaseConfigService } from './config/database/configuration.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule, AppConfigModule],
      useClass: DatabaseConfigService,
      inject: [DatabaseConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
