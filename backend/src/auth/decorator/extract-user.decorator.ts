import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description Request 객체에서 user 정보를 추출
 * @note FtGuard, UserGuard, GuestGuard와 같이 passport 라이브러리 사용할 경우에만 사용
 * @return user : LoginInfoDto
 * @ExtractUser() user: LoginInfoDto 로 사용
 */
export const ExtractUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // TODO undefined error 처리
  return request.user;
});
