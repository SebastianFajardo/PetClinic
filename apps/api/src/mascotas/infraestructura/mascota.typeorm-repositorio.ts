import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosMascota } from '../dominio/mascota';
import { MascotaRepositorio } from '../dominio/mascota.repositorio';
import { MascotaOrm } from './mascota.orm-entity';

@Injectable()
export class MascotaTypeOrmRepositorio implements MascotaRepositorio {
  constructor(@InjectRepository(MascotaOrm) private readonly repositorio: Repository<MascotaOrm>) {}

  async guardar(datos: DatosMascota): Promise<DatosMascota> {
    return this.repositorio.save(this.repositorio.create(datos));
  }

  async buscarPorId(id: string): Promise<DatosMascota | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listar(): Promise<DatosMascota[]> {
    return this.repositorio.find({ order: { creadoEn: 'DESC' } });
  }

  async listarPorPropietario(propietarioId: string): Promise<DatosMascota[]> {
    return this.repositorio.find({ where: { propietarioId }, order: { creadoEn: 'DESC' } });
  }

  async eliminar(id: string): Promise<boolean> {
    const resultado = await this.repositorio.delete(id);
    return (resultado.affected ?? 0) > 0;
  }
}
