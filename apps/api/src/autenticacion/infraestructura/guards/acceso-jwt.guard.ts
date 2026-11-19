import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsuarioAutenticado } from '../../dominio/usuario';

interface SolicitudAutenticada extends Request {
  usuario?: UsuarioAutenticado;
}

@Injectable()
export class AccesoJwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const solicitud = contexto.switchToHttp().getRequest<SolicitudAutenticada>();
    const encabezado = solicitud.headers.authorization;
    if (!encabezado?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Se requiere autenticación');
    }
    try {
      const carga = await this.jwt.verifyAsync<{ sub: string; email: string; role: UsuarioAutenticado['rol'] }>(
        encabezado.slice(7),
      );
      solicitud.usuario = { id: carga.sub, correo: carga.email, rol: carga.role, nombre: '' };
      return true;
    } catch {
      throw new UnauthorizedException('La sesión no es válida o ha expirado');
    }
  }
}
