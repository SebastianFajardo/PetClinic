import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { DatosOwner } from '../domain/owner';
import { OwnerRepositorio } from '../domain/owner.repository';
import { OwnerOrm } from './owner.orm-entity';

@Injectable()
export class OwnerTypeOrmRepository implements OwnerRepositorio {
  constructor(@InjectRepository(OwnerOrm) private readonly repository: Repository<OwnerOrm>) {}

  async save(datos: DatosOwner): Promise<DatosOwner> {
    const entidad = this.repository.create(datos);
    return this.repository.save(entidad);
  }

  async findById(id: string): Promise<DatosOwner | null> {
    return this.repository.findOne({ where: { id } });
  }

  async list(): Promise<DatosOwner[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async delete(id: string): Promise<boolean> {
    const resultado = await this.repository.delete(id);
    return (resultado.affected ?? 0) > 0;
  }

  async existsByDocumentNumber(documentNumber: string, excluirId?: string): Promise<boolean> {
    return this.repository.exists({ where: { documentNumber, ...(excluirId ? { id: Not(excluirId) } : {}) } });
  }

  async existsByEmail(email: string, excluirId?: string): Promise<boolean> {
    return this.repository.exists({ where: { email, ...(excluirId ? { id: Not(excluirId) } : {}) } });
  }
}
