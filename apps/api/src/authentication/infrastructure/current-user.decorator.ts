import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../domain/user';

export const CurrentUser = createParamDecorator(
  (_datos: unknown, contexto: ExecutionContext): AuthenticatedUser => {
    const solicitud = contexto.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return solicitud.user;
  },
);
