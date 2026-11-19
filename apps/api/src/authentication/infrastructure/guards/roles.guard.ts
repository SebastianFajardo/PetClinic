import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUser } from '../../domain/user';

export const ROLES_PERMITIDOS = 'roles_permitidos';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RolUser[]>(ROLES_PERMITIDOS, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (!roles?.length) return true;
    const solicitud = contexto.switchToHttp().getRequest<{ user?: { role: RolUser } }>();
    if (!solicitud.user || !roles.includes(solicitud.user.role)) {
      throw new ForbiddenException('No tiene permisos para realizar esta operación');
    }
    return true;
  }
}
