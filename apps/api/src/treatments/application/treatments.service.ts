import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PetRepository } from '../../pets/domain/pet.repository';
import { Treatment, TreatmentControl, TreatmentControlData, TreatmentData, TreatmentStatus } from '../domain/treatment';
import { TreatmentRepository } from '../domain/treatment.repository';

export interface CreateTreatment {
  petId: string;
  medicalRecordId?: string;
  veterinarianName: string;
  name: string;
  description: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  startDate: string;
  endDate?: string;
  nextControlAt?: string;
  notes?: string;
}

export interface CreateTreatmentControl {
  controlDate: string;
  observations: string;
  outcome: string;
  nextControlAt?: string;
}

@Injectable()
export class TreatmentsService {
  constructor(
    @Inject('TreatmentRepository') private readonly repository: TreatmentRepository,
    @Inject('PetRepository') private readonly pets: PetRepository,
  ) {}

  async create(input: CreateTreatment): Promise<TreatmentData> {
    if (!(await this.pets.findById(input.petId))) throw new NotFoundException('Pet was not found');
    const now = new Date();
    const treatment = Treatment.create({
      id: randomUUID(),
      petId: input.petId,
      medicalRecordId: input.medicalRecordId || null,
      veterinarianName: input.veterinarianName.trim(),
      name: input.name.trim(),
      description: input.description.trim(),
      medication: input.medication?.trim() || null,
      dosage: input.dosage?.trim() || null,
      frequency: input.frequency?.trim() || null,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      status: 'active',
      nextControlAt: input.nextControlAt ? new Date(input.nextControlAt) : null,
      notes: input.notes?.trim() || null,
      controls: [],
      createdAt: now,
      updatedAt: now,
    });
    return this.repository.save(treatment.toData());
  }

  async list(petId?: string): Promise<TreatmentData[]> {
    if (petId && !(await this.pets.findById(petId))) throw new NotFoundException('Pet was not found');
    return this.repository.list(petId);
  }

  async getById(id: string): Promise<TreatmentData> {
    const treatment = await this.repository.findById(id);
    if (!treatment) throw new NotFoundException('Treatment was not found');
    return treatment;
  }

  async addControl(id: string, input: CreateTreatmentControl): Promise<TreatmentControlData> {
    const treatment = await this.getById(id);
    if (treatment.status !== 'active') throw new ConflictException('Controls can only be added to active treatments');
    const now = new Date();
    const control = TreatmentControl.create({
      id: randomUUID(),
      treatmentId: id,
      controlDate: new Date(input.controlDate),
      observations: input.observations.trim(),
      outcome: input.outcome.trim(),
      nextControlAt: input.nextControlAt ? new Date(input.nextControlAt) : null,
      createdAt: now,
    });
    const saved = await this.repository.addControl(control.toData());
    await this.repository.save({
      ...treatment,
      nextControlAt: saved.nextControlAt,
      updatedAt: now,
    });
    return saved;
  }

  async updateStatus(id: string, status: TreatmentStatus): Promise<TreatmentData> {
    const treatment = await this.getById(id);
    if (treatment.status !== 'active' && treatment.status !== status) {
      throw new ConflictException('A finished treatment cannot change its status');
    }
    return this.repository.save({ ...treatment, status, updatedAt: new Date() });
  }
}
