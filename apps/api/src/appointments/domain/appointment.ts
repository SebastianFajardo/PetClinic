import { BusinessRuleError } from '../../shared/domain/business-rule.error';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface AppointmentData {
  id: string;
  petId: string;
  dateTime: Date;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Appointment {
  private constructor(private readonly datos: AppointmentData) {}

  static create(datos: AppointmentData): Appointment {
    if (!datos.petId.trim()) throw new BusinessRuleError('La pet es obligatoria');
    if (Number.isNaN(datos.dateTime.getTime())) throw new BusinessRuleError('The appointment date is invalid');
    if (!Number.isInteger(datos.durationMinutes) || datos.durationMinutes < 15 || datos.durationMinutes > 240) {
      throw new BusinessRuleError('La duración debe estar entre 15 y 240 minutos');
    }
    if (!datos.reason.trim()) throw new BusinessRuleError('El reason de la appointment es obligatorio');
    return new Appointment(datos);
  }

  toData(): AppointmentData {
    return { ...this.datos };
  }
}
