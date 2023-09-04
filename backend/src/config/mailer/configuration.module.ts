import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

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
