import { AppointmentData } from './appointment';

export interface AppointmentRepository {
  save(datos: AppointmentData): Promise<AppointmentData>;
  findById(id: string): Promise<AppointmentData | null>;
  list(from?: Date, to?: Date): Promise<AppointmentData[]>;
  hasOverlap(petId: string, start: Date, end: Date, excludedId?: string): Promise<boolean>;
}
