export type RolUser = 'admin' | 'veterinarian' | 'assistant' | 'receptionist';

export interface DatosUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: RolUser;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: RolUser;
}

export function obtenerAuthenticatedUser(datos: DatosUser): AuthenticatedUser {
  return { id: datos.id, name: datos.name, email: datos.email, role: datos.role };
}
