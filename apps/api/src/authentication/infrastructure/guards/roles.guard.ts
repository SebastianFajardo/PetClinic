import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUser } from '../../domain/user';

export const ROLES_PERMITIDOS = 'roles_permitidos';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RolUser[]>(ROLES_PERMITIDOS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest<{ user?: { role: RolUser } }>();
    if (!request.user || !roles.includes(request.user.role)) {
      throw new ForbiddenException('No tiene permisos para realizar esta operación');
    }
    return true;
  }
}
