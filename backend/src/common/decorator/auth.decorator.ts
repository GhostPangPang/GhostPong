import { createParamDecorator } from '@nestjs/common';

export const ReqToken = createParamDecorator<string>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(request);
  const token = request.token;

  return data ? token?.[data] : token;
});
