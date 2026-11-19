import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DatosPropietario } from '../dominio/propietario';
import { PropietarioRepositorio } from '../dominio/propietario.repositorio';
import { PropietarioOrm } from './propietario.orm-entity';

@Injectable()
export class PropietarioTypeOrmRepositorio implements PropietarioRepositorio {
  constructor(@InjectRepository(PropietarioOrm) private readonly repositorio: Repository<PropietarioOrm>) {}

  async guardar(datos: DatosPropietario): Promise<DatosPropietario> {
    const entidad = this.repositorio.create(datos);
    return this.repositorio.save(entidad);
  }

  async buscarPorId(id: string): Promise<DatosPropietario | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listar(): Promise<DatosPropietario[]> {
    return this.repositorio.find({ order: { creadoEn: 'DESC' } });
  }

  async eliminar(id: string): Promise<boolean> {
    const resultado = await this.repositorio.delete(id);
    return (resultado.affected ?? 0) > 0;
  }

  async existeDocumento(documento: string, excluirId?: string): Promise<boolean> {
    return this.repositorio.exists({ where: { documento, ...(excluirId ? { id: Not(excluirId) } : {}) } });
  }

  async existeCorreo(correo: string, excluirId?: string): Promise<boolean> {
    return this.repositorio.exists({ where: { correo, ...(excluirId ? { id: Not(excluirId) } : {}) } });
  }
}
