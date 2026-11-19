import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { AppointmentData } from '../domain/appointment';
import { AppointmentRepository } from '../domain/appointment.repository';
import { AppointmentOrm } from './appointment.orm-entity';

@Injectable()
export class AppointmentTypeOrmRepository implements AppointmentRepository {
  constructor(@InjectRepository(AppointmentOrm) private readonly repository: Repository<AppointmentOrm>) {}

  async save(datos: AppointmentData): Promise<AppointmentData> {
    return this.repository.save(this.repository.create(datos));
  }

  async findById(id: string): Promise<AppointmentData | null> {
    return this.repository.findOne({ where: { id } });
  }

  async list(desde?: Date, hasta?: Date): Promise<AppointmentData[]> {
    const where = desde && hasta
      ? { dateTime: Between(desde, hasta) }
      : desde
        ? { dateTime: MoreThan(desde) }
        : hasta
          ? { dateTime: LessThan(hasta) }
          : {};
    return this.repository.find({ where, order: { dateTime: 'ASC' } });
  }

  async existeCruce(petId: string, start: Date, end: Date, excluirId?: string): Promise<boolean> {
    const consulta = this.repository.createQueryBuilder('appointment')
      .where('appointment.pet_id = :petId', { petId })
      .andWhere('appointment.status IN (:...estados)', { estados: ['scheduled', 'confirmed'] })
      .andWhere('appointment.scheduled_at < :end', { end })
      .andWhere("appointment.scheduled_at + (appointment.duration_minutes * interval '1 minute') > :start", { start });
    if (excluirId) consulta.andWhere('appointment.id != :excluirId', { excluirId });
    return consulta.getExists();
  }
}
