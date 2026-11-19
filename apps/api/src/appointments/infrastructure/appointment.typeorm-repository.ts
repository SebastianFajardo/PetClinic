import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { AppointmentData } from '../domain/appointment';
import { AppointmentRepository } from '../domain/appointment.repository';
import { AppointmentOrm } from './appointment.orm-entity';

@Injectable()
export class AppointmentTypeOrmRepository implements AppointmentRepository {
  constructor(@InjectRepository(AppointmentOrm) private readonly repository: Repository<AppointmentOrm>) {}

  async save(data: AppointmentData): Promise<AppointmentData> {
    return this.repository.save(this.repository.create(data));
  }

  async findById(id: string): Promise<AppointmentData | null> {
    return this.repository.findOne({ where: { id } });
  }

  async list(from?: Date, to?: Date): Promise<AppointmentData[]> {
    const where = from && to
      ? { dateTime: Between(from, to) }
      : from
        ? { dateTime: MoreThan(from) }
        : to
          ? { dateTime: LessThan(to) }
          : {};
    return this.repository.find({ where, order: { dateTime: 'ASC' } });
  }

  async hasOverlap(petId: string, start: Date, end: Date, excludedId?: string): Promise<boolean> {
    const consulta = this.repository.createQueryBuilder('appointment')
      .where('appointment.pet_id = :petId', { petId })
      .andWhere('appointment.status IN (:...estados)', { estados: ['scheduled', 'confirmed'] })
      .andWhere('appointment.scheduled_at < :end', { end })
      .andWhere("appointment.scheduled_at + (appointment.duration_minutes * interval '1 minute') > :start", { start });
    if (excludedId) consulta.andWhere('appointment.id != :excludedId', { excludedId });
    return consulta.getExists();
  }
}
