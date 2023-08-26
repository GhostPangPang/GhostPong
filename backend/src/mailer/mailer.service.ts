import { Injectable } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { MailerConfigService } from '../config/mailer/configuration.service';

@Injectable()
export class MailerService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(private readonly mailerConfigService: MailerConfigService) {
    this.transporter = createTransport(this.mailerConfigService.mailerOptions.transport);
  }

  sendMail(sendMailOptions: SendMailOptions): Promise<SMTPTransport.SentMessageInfo> {
    return this.transporter.sendMail({ ...this.mailerConfigService.mailerOptions.defaults, ...sendMailOptions });
  }
}
