import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PetRepository } from '../../pets/domain/pet.repository';
import { MedicalRecordData, MedicalRecord } from '../domain/medical-record';
import { MedicalRecordRepository } from '../domain/medical-record.repository';

export interface CreateMedicalRecord {
  petId: string;
  veterinarianName: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  recordedAt?: string;
}

@Injectable()
export class MedicalRecordsService {
  constructor(
    @Inject('MedicalRecordRepository') private readonly repository: MedicalRecordRepository,
    @Inject('PetRepository') private readonly mascotas: PetRepository,
  ) {}

  async create(input: CreateMedicalRecord): Promise<MedicalRecordData> {
    const pet = await this.mascotas.findById(input.petId);
    if (!pet) throw new NotFoundException('The associated pet was not found');
    const now = new Date();
    const record = MedicalRecord.create({
      id: randomUUID(),
      petId: input.petId,
      veterinarianName: input.veterinarianName.trim(),
      reason: input.reason.trim(),
      symptoms: input.symptoms.trim(),
      diagnosis: input.diagnosis.trim(),
      treatment: input.treatment.trim(),
      notes: input.notes?.trim() || null,
      recordedAt: input.recordedAt ? new Date(input.recordedAt) : now,
      createdAt: now,
    });
    return this.repository.save(record.toData());
  }

  async list(petId?: string): Promise<MedicalRecordData[]> {
    if (petId) {
      const pet = await this.mascotas.findById(petId);
      if (!pet) throw new NotFoundException('No se encontró la pet');
      return this.repository.listByPet(petId);
    }
    return this.repository.list();
  }

  async getById(id: string): Promise<MedicalRecordData> {
    const record = await this.repository.findById(id);
    if (!record) throw new NotFoundException('No se encontró la record clínica');
    return record;
  }
}
