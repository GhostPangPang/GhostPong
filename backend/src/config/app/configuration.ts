import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  url: process.env.APP_URL,
  appPort: process.env.APP_PORT,
}));
