export interface Owner {
  id: string;
  name: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'other';
  breed: string | null;
  birthDate: string | null;
  sex: 'male' | 'female' | 'unknown';
  color: string | null;
  weightKg: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerInput {
  name: string;
  lastName: string;
  documentNumber: string;
  email: string;
  phone: string;
  address?: string;
}

export interface PetInput {
  ownerId: string;
  name: string;
  species: Pet['species'];
  breed?: string;
  birthDate?: string;
  sex: Pet['sex'];
  color?: string;
  weightKg?: number;
  notes?: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  petId: string;
  dateTime: string;
  durationMinutes: number;
  reason: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentInput {
  petId: string;
  dateTime: string;
  durationMinutes: number;
  reason: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  veterinarianName: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  recordedAt: string;
  createdAt: string;
}

export interface MedicalRecordInput {
  petId: string;
  veterinarianName: string;
  reason: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  recordedAt?: string;
}

export type TreatmentStatus = 'active' | 'completed' | 'cancelled';

export interface TreatmentControl {
  id: string;
  treatmentId: string;
  controlDate: string;
  observations: string;
  outcome: string;
  nextControlAt: string | null;
  createdAt: string;
}

export interface Treatment {
  id: string;
  petId: string;
  medicalRecordId: string | null;
  veterinarianName: string;
  name: string;
  description: string;
  medication: string | null;
  dosage: string | null;
  frequency: string | null;
  startDate: string;
  endDate: string | null;
  status: TreatmentStatus;
  nextControlAt: string | null;
  notes: string | null;
  controls: TreatmentControl[];
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentInput {
  petId: string;
  veterinarianName: string;
  name: string;
  description: string;
  medication?: string;
  dosage?: string;
  frequency?: string;
  startDate: string;
  endDate?: string;
  nextControlAt?: string;
  notes?: string;
}

export interface TreatmentControlInput {
  controlDate: string;
  observations: string;
  outcome: string;
  nextControlAt?: string;
}

export type InventoryMovementType = 'entry' | 'exit' | 'adjustment';
export interface InventoryItem {
  id: string; name: string; description: string | null; category: string; unit: string;
  quantity: number; minimumQuantity: number; isActive: boolean; createdAt: string; updatedAt: string;
}
export interface InventoryMovement {
  id: string; itemId: string; type: InventoryMovementType; quantity: number;
  previousQuantity: number; newQuantity: number; reason: string; createdAt: string;
}
export interface InventoryItemInput {
  name: string; description?: string; category: string; unit: string; minimumQuantity?: number;
}
export interface InventoryMovementInput {
  itemId: string; type: InventoryMovementType; quantity: number; reason: string;
}
