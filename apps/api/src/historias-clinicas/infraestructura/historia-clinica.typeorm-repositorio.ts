import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatosHistoriaClinica } from '../dominio/historia-clinica';
import { HistoriaClinicaRepositorio } from '../dominio/historia-clinica.repositorio';
import { HistoriaClinicaOrm } from './historia-clinica.orm-entity';

@Injectable()
export class HistoriaClinicaTypeOrmRepositorio implements HistoriaClinicaRepositorio {
  constructor(@InjectRepository(HistoriaClinicaOrm) private readonly repositorio: Repository<HistoriaClinicaOrm>) {}

  async guardar(datos: DatosHistoriaClinica): Promise<DatosHistoriaClinica> {
    return this.repositorio.save(this.repositorio.create(datos));
  }

  async buscarPorId(id: string): Promise<DatosHistoriaClinica | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listar(): Promise<DatosHistoriaClinica[]> {
    return this.repositorio.find({ order: { registradaEn: 'DESC' } });
  }

  async listarPorMascota(mascotaId: string): Promise<DatosHistoriaClinica[]> {
    return this.repositorio.find({ where: { mascotaId }, order: { registradaEn: 'DESC' } });
  }
}
