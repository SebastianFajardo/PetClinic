import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { compare, hash } from 'bcryptjs';
import { DatosUsuario, obtenerUsuarioAutenticado } from '../dominio/usuario';
import { UsuarioTypeOrmRepositorio } from '../infraestructura/usuario.typeorm-repositorio';

export interface RegistrarUsuario {
  nombre: string;
  correo: string;
  contrasena: string;
}

@Injectable()
export class AutenticacionServicio {
  constructor(private readonly usuarios: UsuarioTypeOrmRepositorio, private readonly jwt: JwtService) {}

  async registrar(entrada: RegistrarUsuario) {
    const correo = entrada.correo.trim().toLowerCase();
    if (await this.usuarios.buscarPorCorreo(correo)) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const ahora = new Date();
    const usuario: DatosUsuario = {
      id: randomUUID(),
      nombre: entrada.nombre.trim(),
      correo,
      contrasenaHash: await hash(entrada.contrasena, 12),
      rol: 'assistant',
      activo: true,
      creadoEn: ahora,
      actualizadoEn: ahora,
    };
    return this.generarSesion(await this.usuarios.guardar(usuario));
  }

  async iniciarSesion(correoEntrada: string, contrasena: string) {
    const usuario = await this.usuarios.buscarPorCorreo(correoEntrada.trim().toLowerCase());
    if (!usuario || !usuario.activo || !(await compare(contrasena, usuario.contrasenaHash))) {
      throw new UnauthorizedException('Credenciales no válidas');
    }
    return this.generarSesion(usuario);
  }

  private async generarSesion(usuario: DatosUsuario) {
    const identidad = obtenerUsuarioAutenticado(usuario);
    const accessToken = await this.jwt.signAsync({
      sub: identidad.id,
      email: identidad.correo,
      name: identidad.nombre,
      role: identidad.rol,
    });
    return { accessToken, user: identidad };
  }
}
