export interface Owner {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
  direccion: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Pet {
  id: string;
  propietarioId: string;
  nombre: string;
  especie: 'dog' | 'cat' | 'bird' | 'other';
  raza: string | null;
  fechaNacimiento: string | null;
  sexo: 'male' | 'female' | 'unknown';
  color: string | null;
  pesoKg: number | null;
  notas: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface OwnerInput {
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
  direccion?: string;
}

export interface PetInput {
  propietarioId: string;
  nombre: string;
  especie: Pet['especie'];
  raza?: string;
  fechaNacimiento?: string;
  sexo: Pet['sexo'];
  color?: string;
  pesoKg?: number;
  notas?: string;
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
