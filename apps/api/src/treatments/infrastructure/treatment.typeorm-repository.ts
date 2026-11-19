import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreatmentControlData, TreatmentData } from '../domain/treatment';
import { TreatmentRepository } from '../domain/treatment.repository';
import { TreatmentControlOrm } from './treatment-control.orm-entity';
import { TreatmentOrm } from './treatment.orm-entity';

@Injectable()
export class TreatmentTypeOrmRepository implements TreatmentRepository {
  constructor(
    @InjectRepository(TreatmentOrm) private readonly treatments: Repository<TreatmentOrm>,
    @InjectRepository(TreatmentControlOrm) private readonly controls: Repository<TreatmentControlOrm>,
  ) {}

  async save(data: TreatmentData): Promise<TreatmentData> {
    const { controls, ...treatment } = data;
    await this.treatments.save(this.treatments.create(treatment));
    const saved = await this.findById(data.id);
    if (!saved) throw new Error('Treatment could not be loaded after saving');
    return saved;
  }

  async findById(id: string): Promise<TreatmentData | null> {
    return this.treatments.findOne({ where: { id }, relations: { controls: true } });
  }

  async list(petId?: string): Promise<TreatmentData[]> {
    return this.treatments.find({
      where: petId ? { petId } : {},
      relations: { controls: true },
      order: { startDate: 'DESC', controls: { controlDate: 'DESC' } },
    });
  }

  async addControl(data: TreatmentControlData): Promise<TreatmentControlData> {
    return this.controls.save(this.controls.create(data));
  }
}
