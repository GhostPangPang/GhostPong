import { registerAs } from '@nestjs/config';

export default registerAs('ftAuth', () => ({
  id: process.env.FORTYTWO_APP_ID,
  secret: process.env.FORTYTWO_APP_SECRET,
  url: process.env.FORTYTWO_CALLBACK_URL,
}));
