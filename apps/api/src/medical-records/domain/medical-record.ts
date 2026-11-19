import { ReglaNegocioError } from '../../compartido/domain/regla-negocio.error';

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
  private constructor(private readonly datos: MedicalRecordData) {}

  static create(datos: MedicalRecordData): MedicalRecord {
    if (!datos.petId.trim()) throw new ReglaNegocioError('La pet es obligatoria');
    if (!datos.veterinarianName.trim()) throw new ReglaNegocioError('El name del veterinario es obligatorio');
    if (!datos.reason.trim()) throw new ReglaNegocioError('El reason de consulta es obligatorio');
    if (!datos.symptoms.trim()) throw new ReglaNegocioError('Los síntomas son obligatorios');
    if (!datos.diagnosis.trim()) throw new ReglaNegocioError('El diagnóstico es obligatorio');
    if (!datos.treatment.trim()) throw new ReglaNegocioError('El treatment es obligatorio');
    if (Number.isNaN(datos.recordedAt.getTime())) throw new ReglaNegocioError('La date de consulta no es válida');
    return new MedicalRecord(datos);
  }

  toData(): MedicalRecordData {
    return { ...this.datos };
  }
}
