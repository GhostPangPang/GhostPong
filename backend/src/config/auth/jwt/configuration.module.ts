import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configuration';
import { JwtConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        JWT_SECRETKEY: Joi.string(),
        JWT_EXPIREIN: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, JwtConfigService],
  exports: [ConfigService, JwtConfigService],
})
export class JwtConfigModule {}
