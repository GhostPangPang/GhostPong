import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MailerConfigService {
  constructor(private configService: ConfigService) {}

  get mailerOptions(): MailerOptions {
    return {
      transport: {
        host: 'smtp.gmail.com',
        prot: 587,
        secure: true,
        auth: {
          user: this.configService.get<string>('mailer.mailerUser'),
          pass: this.configService.get<string>('mailer.mailerPass'),
        },
      },
      defaults: {
        from: '"GhostPhong" <no-reply@no-reply.com>',
      },
    };
  }
}
