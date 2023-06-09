import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

import { LoginInfo } from '../type/login-info';

/**
 * @description Request 객체에서 user 정보를 추출
 * @note FtGuard, UserGuard, GuestGuard와 같이 passport 라이브러리 사용할 경우에만 사용
 * @return user : LoginInfo
 * @ExtractUser() user: LoginInfo 로 사용
 */
export const ExtractUser = createParamDecorator((data: unknown, ctx: ExecutionContext): LoginInfo => {
  const request = ctx.switchToHttp().getRequest();

  if (request.user === undefined) {
    throw new BadRequestException('request.user is undefined');
  }
  return request.user;
});
