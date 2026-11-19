import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthenticatedUser } from '../../domain/user';
import { RUTA_PUBLICA } from '../public.decorator';

interface SolicitudAutenticada extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const esPublica = this.reflector.getAllAndOverride<boolean>(RUTA_PUBLICA, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (esPublica) return true;

    const solicitud = contexto.switchToHttp().getRequest<SolicitudAutenticada>();
    const encabezado = solicitud.headers.authorization;
    if (!encabezado?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Se requiere autenticación');
    }
    try {
      const carga = await this.jwt.verifyAsync<{
        sub: string;
        email: string;
        name: string;
        role: AuthenticatedUser['role'];
      }>(encabezado.slice(7));
      solicitud.user = { id: carga.sub, email: carga.email, name: carga.name, role: carga.role };
      return true;
    } catch {
      throw new UnauthorizedException('La sesión no es válida o ha expirado');
    }
  }
}
