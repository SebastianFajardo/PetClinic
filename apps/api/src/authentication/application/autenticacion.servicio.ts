import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { compare, hash } from 'bcryptjs';
import { DatosUser, obtenerUserAutenticado } from '../domain/user';
import { UserTypeOrmRepository } from '../infrastructure/user.typeorm-repositorio';

export interface RegistrarUser {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthenticationService {
  constructor(private readonly usuarios: UserTypeOrmRepository, private readonly jwt: JwtService) {}

  async register(input: RegistrarUser) {
    const email = input.email.trim().toLowerCase();
    if (await this.usuarios.findByEmail(email)) {
      throw new ConflictException('El email electrónico ya está registrado');
    }
    const now = new Date();
    const user: DatosUser = {
      id: randomUUID(),
      name: input.name.trim(),
      email,
      contrasenaHash: await hash(input.password, 12),
      role: 'assistant',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    return this.generarSesion(await this.usuarios.save(user));
  }

  async login(correoEntrada: string, password: string) {
    const user = await this.usuarios.findByEmail(correoEntrada.trim().toLowerCase());
    if (!user || !user.isActive || !(await compare(password, user.contrasenaHash))) {
      throw new UnauthorizedException('Credenciales no válidas');
    }
    return this.generarSesion(user);
  }

  private async generarSesion(user: DatosUser) {
    const identidad = obtenerUserAutenticado(user);
    const accessToken = await this.jwt.signAsync({
      sub: identidad.id,
      email: identidad.email,
      name: identidad.name,
      role: identidad.role,
    });
    return { accessToken, user: identidad };
  }
}
