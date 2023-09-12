import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
  mailerUser: process.env.MAILER_USER,
  mailerPass: process.env.MAILER_PASS,
}));
