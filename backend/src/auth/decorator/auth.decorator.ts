import { createParamDecorator } from '@nestjs/common';

/**
 * @description Request 객체에서 user 정보를 가져옴
 * @note template function -> <string>로 data type 지정
 * @User('email') email: string 로 사용
 * @User() user: User 로 사용
 */
export const ReqUser = createParamDecorator<string>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});
