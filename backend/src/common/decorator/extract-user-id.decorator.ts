import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { AppConfigService } from 'src/config/app/configuration.service';

/**
 * @description token의 userId 추출
 * @note FtGuard, UserGuard, GuestGuard 있을 경우에만 사용
 * @return userId : number
 * @ExtractUserId() userId: number 로 사용
 */
export const ExtractUserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();

  return request.user.userId;
});
