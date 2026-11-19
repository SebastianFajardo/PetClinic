import { ReglaNegocioError } from '../../compartido/domain/regla-negocio.error';

export interface MedicalRecordData {
  id: string;
  petId: string;
  nombreVeterinario: string;
  motivoConsulta: string;
  sintomas: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  recordedAt: Date;
  createdAt: Date;
}

export class MedicalRecord {
  private constructor(private readonly datos: MedicalRecordData) {}

  static create(datos: MedicalRecordData): MedicalRecord {
    if (!datos.petId.trim()) throw new ReglaNegocioError('La mascota es obligatoria');
    if (!datos.nombreVeterinario.trim()) throw new ReglaNegocioError('El name del veterinario es obligatorio');
    if (!datos.motivoConsulta.trim()) throw new ReglaNegocioError('El reason de consulta es obligatorio');
    if (!datos.sintomas.trim()) throw new ReglaNegocioError('Los síntomas son obligatorios');
    if (!datos.diagnosis.trim()) throw new ReglaNegocioError('El diagnóstico es obligatorio');
    if (!datos.treatment.trim()) throw new ReglaNegocioError('El treatment es obligatorio');
    if (Number.isNaN(datos.recordedAt.getTime())) throw new ReglaNegocioError('La date de consulta no es válida');
    return new MedicalRecord(datos);
  }

  obtenerDatos(): MedicalRecordData {
    return { ...this.datos };
  }
}
