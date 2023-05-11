import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
  constructor(private configService: ConfigService) {}

  get mailerOptions() {
    return {
      transport: {
        host: 'smtp.gmail.com',
        prot: 587,
        auth: {
          user: this.configService.get<string>('mailer.mailerUser'),
          pass: this.configService.get<string>('mailer.mailerPass'),
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    };
  }
}
