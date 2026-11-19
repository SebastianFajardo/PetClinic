import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosUsuario } from '../dominio/usuario';
import { UsuarioOrm } from './usuario.orm-entity';

@Injectable()
export class UsuarioTypeOrmRepositorio {
  constructor(@InjectRepository(UsuarioOrm) private readonly repositorio: Repository<UsuarioOrm>) {}

  async guardar(datos: DatosUsuario): Promise<DatosUsuario> {
    return this.repositorio.save(this.repositorio.create(datos));
  }

  async buscarPorCorreo(correo: string): Promise<DatosUsuario | null> {
    return this.repositorio.createQueryBuilder('usuario')
      .addSelect('usuario.contrasenaHash')
      .where('usuario.correo = :correo', { correo })
      .getOne();
  }
}
