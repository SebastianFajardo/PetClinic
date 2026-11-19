import { TreatmentControlData, TreatmentData } from './treatment';

export interface TreatmentRepository {
  save(data: TreatmentData): Promise<TreatmentData>;
  findById(id: string): Promise<TreatmentData | null>;
  list(petId?: string): Promise<TreatmentData[]>;
  addControl(data: TreatmentControlData): Promise<TreatmentControlData>;
}
