import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedUser } from '../../domain/user';
import { PUBLIC_ROUTE } from '../public.decorator';

interface SolicitudAutenticada extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const esPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (esPublic) return true;

    const request = context.switchToHttp().getRequest<SolicitudAutenticada>();
    const encabezado = request.headers.authorization;
    if (!encabezado?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Se requiere autenticación');
    }
    try {
      const carga = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
        name: string;
        rolee: AuthenticatedUser['rolee'];
      }>(encabezado.slice(7));
      request.user = { id: carga.sub, email: carga.email, name: carga.name, rolee: carga.rolee };
      return true;
    } catch {
      throw new UnauthorizedException('La sesión no es válida o ha expirado');
    }
  }
}
