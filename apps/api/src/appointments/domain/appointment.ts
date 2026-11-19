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
  private constructor(private readonly data: AppointmentData) {}

  static create(data: AppointmentData): Appointment {
    if (!data.petId.trim()) throw new BusinessRuleError('The pet es obligatoria');
    if (Number.isNaN(data.dateTime.getTime())) throw new BusinessRuleError('The appointment date is invalid');
    if (!Number.isInteger(data.durationMinutes) || data.durationMinutes < 15 || data.durationMinutes > 240) {
      throw new BusinessRuleError('La duración debe estar entre 15 y 240 minutos');
    }
    if (!data.reason.trim()) throw new BusinessRuleError('El reason de the appointment es obligatorio');
    return new Appointment(data);
  }

  toData(): AppointmentData {
    return { ...this.data };
  }
}
