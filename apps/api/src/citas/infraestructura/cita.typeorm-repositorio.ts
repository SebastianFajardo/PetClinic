import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { DatosCita } from '../dominio/cita';
import { CitaRepositorio } from '../dominio/cita.repositorio';
import { CitaOrm } from './cita.orm-entity';

@Injectable()
export class CitaTypeOrmRepositorio implements CitaRepositorio {
  constructor(@InjectRepository(CitaOrm) private readonly repositorio: Repository<CitaOrm>) {}

  async guardar(datos: DatosCita): Promise<DatosCita> {
    return this.repositorio.save(this.repositorio.create(datos));
  }

  async buscarPorId(id: string): Promise<DatosCita | null> {
    return this.repositorio.findOne({ where: { id } });
  }

  async listar(desde?: Date, hasta?: Date): Promise<DatosCita[]> {
    const where = desde && hasta
      ? { fechaHora: Between(desde, hasta) }
      : desde
        ? { fechaHora: MoreThan(desde) }
        : hasta
          ? { fechaHora: LessThan(hasta) }
          : {};
    return this.repositorio.find({ where, order: { fechaHora: 'ASC' } });
  }

  async existeCruce(mascotaId: string, inicio: Date, fin: Date, excluirId?: string): Promise<boolean> {
    const consulta = this.repositorio.createQueryBuilder('appointment')
      .where('appointment.pet_id = :mascotaId', { mascotaId })
      .andWhere('appointment.status IN (:...estados)', { estados: ['scheduled', 'confirmed'] })
      .andWhere('appointment.scheduled_at < :fin', { fin })
      .andWhere("appointment.scheduled_at + (appointment.duration_minutes * interval '1 minute') > :inicio", { inicio });
    if (excluirId) consulta.andWhere('appointment.id != :excluirId', { excluirId });
    return consulta.getExists();
  }
}
