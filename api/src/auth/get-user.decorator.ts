import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/generated/prisma/client';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user: User }>();
  return req.user;
});
