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
    if (!data.petId.trim()) throw new BusinessRuleError('A pet is required');
    if (Number.isNaN(data.dateTime.getTime())) throw new BusinessRuleError('The appointment date is invalid');
    if (!Number.isInteger(data.durationMinutes) || data.durationMinutes < 15 || data.durationMinutes > 240) {
      throw new BusinessRuleError('Duration must be between 15 and 240 minutes');
    }
    if (!data.reason.trim()) throw new BusinessRuleError('The appointment reason is required');
    return new Appointment(data);
  }

  toData(): AppointmentData {
    return { ...this.data };
  }
}
