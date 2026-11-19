import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DatosOwner } from '../domain/owner';
import { OwnerRepositorio } from '../domain/owner.repository';
import { OwnerOrm } from './owner.orm-entity';

@Injectable()
export class OwnerTypeOrmRepository implements OwnerRepositorio {
  constructor(@InjectRepository(OwnerOrm) private readonly repository: Repository<OwnerOrm>) {}

  async guardar(datos: DatosOwner): Promise<DatosOwner> {
    const entidad = this.repository.create(datos);
    return this.repository.save(entidad);
  }

  async buscarPorId(id: string): Promise<DatosOwner | null> {
    return this.repository.findOne({ where: { id } });
  }

  async listar(): Promise<DatosOwner[]> {
    return this.repository.find({ order: { creadoEn: 'DESC' } });
  }

  async eliminar(id: string): Promise<boolean> {
    const resultado = await this.repository.delete(id);
    return (resultado.affected ?? 0) > 0;
  }

  async existeDocumento(documento: string, excluirId?: string): Promise<boolean> {
    return this.repository.exists({ where: { documento, ...(excluirId ? { id: Not(excluirId) } : {}) } });
  }

  async existeCorreo(correo: string, excluirId?: string): Promise<boolean> {
    return this.repository.exists({ where: { correo, ...(excluirId ? { id: Not(excluirId) } : {}) } });
  }
}
