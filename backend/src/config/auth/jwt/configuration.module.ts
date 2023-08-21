import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configuration';
import { JwtConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
      validationSchema: Joi.object({
        USER_JWT_SECRETKEY: Joi.string(),
        AUTH_JWT_SECRETKEY: Joi.string(),
        TWOFA_JWT_SECRETKEY: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, JwtConfigService],
  exports: [ConfigService, JwtConfigService],
})
export class JwtConfigModule {}
