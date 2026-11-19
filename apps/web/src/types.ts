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

export interface Appointment {
  id: string;
  mascotaId: string;
  fechaHora: string;
  duracionMinutos: number;
  motivo: string;
  estado: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  observaciones: string | null;
  creadaEn: string;
  actualizadaEn: string;
}

export interface AppointmentInput {
  mascotaId: string;
  fechaHora: string;
  duracionMinutos: number;
  motivo: string;
  observaciones?: string;
}

export interface MedicalRecord {
  id: string;
  mascotaId: string;
  nombreVeterinario: string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string | null;
  registradaEn: string;
  creadaEn: string;
}

export interface MedicalRecordInput {
  mascotaId: string;
  nombreVeterinario: string;
  motivoConsulta: string;
  sintomas: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  registradaEn?: string;
}
