import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../domain/user';

export const ROLES_PERMITIDOS = 'rolees_permitidos';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolees = this.reflector.getAllAndOverride<UserRole[]>(ROLES_PERMITIDOS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!rolees?.length) return true;
    const request = context.switchToHttp().getRequest<{ user?: { rolee: UserRole } }>();
    if (!request.user || !rolees.includes(request.user.rolee)) {
      throw new ForbiddenException('No tiene permisos para realizar esta operación');
    }
    return true;
  }
}
