import { BusinessRuleError } from '../../compartido/domain/regla-negocio.error';

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
    if (!data.petId.trim()) throw new BusinessRuleError('La pet es obligatoria');
    if (!data.veterinarianName.trim()) throw new BusinessRuleError('El name del veterinario es obligatorio');
    if (!data.reason.trim()) throw new BusinessRuleError('El reason de consulta es obligatorio');
    if (!data.symptoms.trim()) throw new BusinessRuleError('Los síntomas son obligatorios');
    if (!data.diagnosis.trim()) throw new BusinessRuleError('El diagnóstico es obligatorio');
    if (!data.treatment.trim()) throw new BusinessRuleError('El treatment es obligatorio');
    if (Number.isNaN(data.recordedAt.getTime())) throw new BusinessRuleError('La date de consulta no es válida');
    return new MedicalRecord(data);
  }

  toData(): MedicalRecordData {
    return { ...this.data };
  }
}
