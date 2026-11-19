import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PetRepository } from '../../mascotas/domain/mascota.repository';
import { MedicalRecordData, MedicalRecord } from '../domain/medical-record';
import { MedicalRecordRepository } from '../domain/medical-record.repository';

export interface CreateMedicalRecord {
  petId: string;
  nombreVeterinario: string;
  motivoConsulta: string;
  sintomas: string;
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
    const mascota = await this.mascotas.findById(input.petId);
    if (!mascota) throw new NotFoundException('No se encontró la mascota asociada');
    const now = new Date();
    const historia = MedicalRecord.create({
      id: randomUUID(),
      petId: input.petId,
      nombreVeterinario: input.nombreVeterinario.trim(),
      motivoConsulta: input.motivoConsulta.trim(),
      sintomas: input.sintomas.trim(),
      diagnosis: input.diagnosis.trim(),
      treatment: input.treatment.trim(),
      notes: input.notes?.trim() || null,
      recordedAt: input.recordedAt ? new Date(input.recordedAt) : now,
      createdAt: now,
    });
    return this.repository.save(historia.obtenerDatos());
  }

  async list(petId?: string): Promise<MedicalRecordData[]> {
    if (petId) {
      const mascota = await this.mascotas.findById(petId);
      if (!mascota) throw new NotFoundException('No se encontró la mascota');
      return this.repository.listByPet(petId);
    }
    return this.repository.list();
  }

  async getById(id: string): Promise<MedicalRecordData> {
    const historia = await this.repository.findById(id);
    if (!historia) throw new NotFoundException('No se encontró la historia clínica');
    return historia;
  }
}
