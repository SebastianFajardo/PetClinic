import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecordData } from '../domain/medical-record';
import { MedicalRecordRepository } from '../domain/medical-record.repository';
import { MedicalRecordOrm } from './medical-record.orm-entity';

@Injectable()
export class MedicalRecordTypeOrmRepository implements MedicalRecordRepository {
  constructor(@InjectRepository(MedicalRecordOrm) private readonly repository: Repository<MedicalRecordOrm>) {}

  async save(data: MedicalRecordData): Promise<MedicalRecordData> {
    return this.repository.save(this.repository.create(data));
  }

  async findById(id: string): Promise<MedicalRecordData | null> {
    return this.repository.findOne({ where: { id } });
  }

  async list(): Promise<MedicalRecordData[]> {
    return this.repository.find({ order: { recordedAt: 'DESC' } });
  }

  async listByPet(petId: string): Promise<MedicalRecordData[]> {
    return this.repository.find({ where: { petId }, order: { recordedAt: 'DESC' } });
  }
}
