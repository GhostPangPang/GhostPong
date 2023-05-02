import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description Request 객체에서 user 정보를 가져옴
 * @ExtractUser() user: User 로 사용
 */
export const ExtractUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
