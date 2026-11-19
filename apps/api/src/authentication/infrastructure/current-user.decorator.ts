import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserAutenticado } from '../domain/user';

export const CurrentUser = createParamDecorator(
  (_datos: unknown, contexto: ExecutionContext): UserAutenticado => {
    const solicitud = contexto.switchToHttp().getRequest<{ user: UserAutenticado }>();
    return solicitud.user;
  },
);
