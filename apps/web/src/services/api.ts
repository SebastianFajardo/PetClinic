import type { Appointment, AppointmentInput, MedicalRecord, MedicalRecordInput, Owner, OwnerInput, Pet, PetInput } from '../types';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
const tokenKey = 'petclinic_access_token';

export interface AuthUser {
  id: string;
  nombre: string;
  correo: string;
  rol: 'admin' | 'veterinarian' | 'assistant' | 'receptionist';
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export const sessionStorage = {
  getToken: () => window.localStorage.getItem(tokenKey),
  save: (session: AuthSession) => window.localStorage.setItem(tokenKey, session.accessToken),
  clear: () => window.localStorage.removeItem(tokenKey),
};

async function request<T>(path: string, options?: RequestInit, authenticated = true): Promise<T> {
  const token = authenticated ? sessionStorage.getToken() : null;
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(payload?.message) ? payload.message.join(', ') : payload?.message;
    if (response.status === 401 && authenticated) sessionStorage.clear();
    throw new Error(message ?? 'No fue posible completar la solicitud');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>('/health', undefined, false),
  auth: {
    login: (correo: string, contrasena: string) =>
      request<AuthSession>('/auth/login', { method: 'POST', body: JSON.stringify({ correo, contrasena }) }, false),
    register: (nombre: string, correo: string, contrasena: string) =>
      request<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify({ nombre, correo, contrasena }) }, false),
    me: () => request<AuthUser>('/auth/me'),
  },
  owners: {
    list: () => request<Owner[]>('/owners'),
    create: (input: OwnerInput) => request<Owner>('/owners', { method: 'POST', body: JSON.stringify(input) }),
  },
  pets: {
    list: () => request<Pet[]>('/pets'),
    create: (input: PetInput) => request<Pet>('/pets', { method: 'POST', body: JSON.stringify(input) }),
  },
  appointments: {
    list: () => request<Appointment[]>('/appointments'),
    create: (input: AppointmentInput) => request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(input) }),
    updateStatus: (id: string, estado: Appointment['estado']) =>
      request<Appointment>(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ estado }) }),
  },
  medicalRecords: {
    list: () => request<MedicalRecord[]>('/medical-records'),
    create: (input: MedicalRecordInput) =>
      request<MedicalRecord>('/medical-records', { method: 'POST', body: JSON.stringify(input) }),
  },
};
