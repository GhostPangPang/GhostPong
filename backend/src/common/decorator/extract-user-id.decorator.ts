import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description token의 userId 추출
 * @note FtGuard, UserGuard, GuestGuard 있을 경우에만 사용
 * @return userId : number
 * @ExtractUserId() userId: number 로 사용
 */
export const ExtractUserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();

  if (request.user?.userId === undefined) {
    throw new BadRequestException('request.user or request.user.userId is undefined');
  }
  return request.user.userId;
});
