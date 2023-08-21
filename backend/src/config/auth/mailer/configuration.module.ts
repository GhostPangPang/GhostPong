import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import configuration from './configuration';
import { MailerConfigService } from './configuration.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
      validationSchema: Joi.object({
        MAILER_USER: Joi.string(),
        MAILER_PASS: Joi.string(),
      }),
    }),
  ],
  providers: [ConfigService, MailerConfigService],
  exports: [ConfigService, MailerConfigService],
})
export class MailerConfigModule {}
