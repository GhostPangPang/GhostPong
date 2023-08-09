import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configuration';
import { FtAuthConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
      validationSchema: Joi.object({
        FORTYTWO_APP_ID: Joi.string(),
        FORTYTWO_APP_SECRET: Joi.string(),
        CALLBACK_URL: Joi.string().default('localhost'),
      }),
    }),
  ],
  providers: [ConfigService, FtAuthConfigService],
  exports: [ConfigService, FtAuthConfigService],
})
export class FtAuthConfigModule {}
