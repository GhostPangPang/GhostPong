import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  userSecretKey: process.env.USER_JWT_SECRETKEY,
  userExpireIn: process.env.USER_JWT_EXPIREIN,
  authSecretKey: process.env.AUTH_JWT_SECRETKEY,
  authExpireIn: process.env.AUTH_JWT_EXPIREIN,
}));
