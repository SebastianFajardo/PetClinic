import { BusinessRuleError } from '../../shared/domain/business-rule.error';

export type TreatmentStatus = 'active' | 'completed' | 'cancelled';

export interface TreatmentControlData {
  id: string;
  treatmentId: string;
  controlDate: Date;
  observations: string;
  outcome: string;
  nextControlAt: Date | null;
  createdAt: Date;
}

export interface TreatmentData {
  id: string;
  petId: string;
  medicalRecordId: string | null;
  veterinarianName: string;
  name: string;
  description: string;
  medication: string | null;
  dosage: string | null;
  frequency: string | null;
  startDate: Date;
  endDate: Date | null;
  status: TreatmentStatus;
  nextControlAt: Date | null;
  notes: string | null;
  controls?: TreatmentControlData[];
  createdAt: Date;
  updatedAt: Date;
}

export class Treatment {
  private constructor(private readonly data: TreatmentData) {}

  static create(data: TreatmentData): Treatment {
    if (!data.petId.trim()) throw new BusinessRuleError('A pet is required');
    if (!data.veterinarianName.trim()) throw new BusinessRuleError('Veterinarian name is required');
    if (!data.name.trim()) throw new BusinessRuleError('Treatment name is required');
    if (!data.description.trim()) throw new BusinessRuleError('Treatment description is required');
    if (Number.isNaN(data.startDate.getTime())) throw new BusinessRuleError('The treatment start date is invalid');
    if (data.endDate && Number.isNaN(data.endDate.getTime())) throw new BusinessRuleError('The treatment end date is invalid');
    if (data.endDate && data.endDate < data.startDate) throw new BusinessRuleError('The treatment end date must be after its start date');
    if (data.nextControlAt && Number.isNaN(data.nextControlAt.getTime())) throw new BusinessRuleError('The next control date is invalid');
    return new Treatment(data);
  }

  toData(): TreatmentData {
    return { ...this.data };
  }
}

export class TreatmentControl {
  private constructor(private readonly data: TreatmentControlData) {}

  static create(data: TreatmentControlData): TreatmentControl {
    if (!data.treatmentId.trim()) throw new BusinessRuleError('A treatment is required');
    if (Number.isNaN(data.controlDate.getTime())) throw new BusinessRuleError('The control date is invalid');
    if (!data.observations.trim()) throw new BusinessRuleError('Control observations are required');
    if (!data.outcome.trim()) throw new BusinessRuleError('Control outcome is required');
    if (data.nextControlAt && Number.isNaN(data.nextControlAt.getTime())) throw new BusinessRuleError('The next control date is invalid');
    return new TreatmentControl(data);
  }

  toData(): TreatmentControlData {
    return { ...this.data };
  }
}
