import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolUsuario } from '../../dominio/usuario';

export const ROLES_PERMITIDOS = 'roles_permitidos';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RolUsuario[]>(ROLES_PERMITIDOS, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (!roles?.length) return true;
    const solicitud = contexto.switchToHttp().getRequest<{ usuario?: { rol: RolUsuario } }>();
    if (!solicitud.usuario || !roles.includes(solicitud.usuario.rol)) {
      throw new ForbiddenException('No tiene permisos para realizar esta operación');
    }
    return true;
  }
}
