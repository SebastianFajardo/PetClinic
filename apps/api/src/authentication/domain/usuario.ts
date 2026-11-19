export type RolUser = 'admin' | 'veterinarian' | 'assistant' | 'receptionist';

export interface DatosUser {
  id: string;
  name: string;
  email: string;
  contrasenaHash: string;
  role: RolUser;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAutenticado {
  id: string;
  name: string;
  email: string;
  role: RolUser;
}

export function obtenerUserAutenticado(datos: DatosUser): UserAutenticado {
  return { id: datos.id, name: datos.name, email: datos.email, role: datos.role };
}
