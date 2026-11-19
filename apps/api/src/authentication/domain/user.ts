export type RolUser = 'admin' | 'veterinarian' | 'assistant' | 'receptionist';

export interface UserData {
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

export function toAuthenticatedUser(data: UserData): AuthenticatedUser {
  return { id: data.id, name: data.name, email: data.email, role: data.role };
}
