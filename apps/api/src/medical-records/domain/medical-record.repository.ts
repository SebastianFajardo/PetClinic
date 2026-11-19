import { MedicalRecordData } from './medical-record';

export interface MedicalRecordRepository {
  save(data: MedicalRecordData): Promise<MedicalRecordData>;
  findById(id: string): Promise<MedicalRecordData | null>;
  list(): Promise<MedicalRecordData[]>;
  listByPet(petId: string): Promise<MedicalRecordData[]>;
}
