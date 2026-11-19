import { BusinessRuleError } from '../../shared/domain/business-rule.error';

export interface MedicalRecordData {
  id: string;
  petId: string;
  veterinarianName: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  recordedAt: Date;
  createdAt: Date;
}

export class MedicalRecord {
  private constructor(private readonly data: MedicalRecordData) {}

  static create(data: MedicalRecordData): MedicalRecord {
    if (!data.petId.trim()) throw new BusinessRuleError('A pet is required');
    if (!data.veterinarianName.trim()) throw new BusinessRuleError('Veterinarian name is required');
    if (!data.reason.trim()) throw new BusinessRuleError('Consultation reason is required');
    if (!data.symptoms.trim()) throw new BusinessRuleError('Symptoms are required');
    if (!data.diagnosis.trim()) throw new BusinessRuleError('Diagnosis is required');
    if (!data.treatment.trim()) throw new BusinessRuleError('Treatment is required');
    if (Number.isNaN(data.recordedAt.getTime())) throw new BusinessRuleError('The consultation date is invalid');
    return new MedicalRecord(data);
  }

  toData(): MedicalRecordData {
    return { ...this.data };
  }
}
