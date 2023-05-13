import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  userSecretKey: process.env.USER_JWT_SECRETKEY,
  authSecretKey: process.env.AUTH_JWT_SECRETKEY,
  twoFaSecretKey: process.env.TWOFA_JWT_SECRETKEY,
}));
