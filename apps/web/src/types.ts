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
