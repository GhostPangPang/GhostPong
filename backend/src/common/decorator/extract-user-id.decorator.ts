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

  // 개발 환경에서는 headers에 있는 x-my-id를 userId로 사용
  if (process.env.NODE_ENV === 'development') {
    return +request.headers['x-my-id'];
  }

  // TODO undefined error 처리
  return request.user.userId;
});
