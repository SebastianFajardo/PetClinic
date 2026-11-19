import type { Appointment, AppointmentInput, AppointmentStatus, MedicalRecord, MedicalRecordInput, Owner, OwnerInput, Pet, PetInput, Treatment, TreatmentControl, TreatmentControlInput, TreatmentInput, TreatmentStatus, InventoryItem, InventoryItemInput, InventoryMovement, InventoryMovementInput } from '../types';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';
const tokenKey = 'petclinic_access_token';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'veterinarian' | 'assistant' | 'receptionist';
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

  if (response.status === 204 || response.status === 205) return undefined as T;
  const responseBody = await response.text();
  if (!responseBody) return undefined as T;
  return JSON.parse(responseBody) as T;
}

export const api = {
  health: () => request<{ status: string }>('/health', undefined, false),
  auth: {
    login: (email: string, password: string) =>
      request<AuthSession>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, false),
    register: (name: string, email: string, password: string) =>
      request<AuthSession>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }, false),
    me: () => request<AuthUser>('/auth/me'),
  },
  owners: {
    list: () => request<Owner[]>('/owners'),
    create: (input: OwnerInput) => request<Owner>('/owners', { method: 'POST', body: JSON.stringify(input) }),
    update: (id: string, input: Partial<OwnerInput>) =>
      request<Owner>(`/owners/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    delete: (id: string) => request<void>(`/owners/${id}`, { method: 'DELETE' }),
  },
  pets: {
    list: () => request<Pet[]>('/pets'),
    create: (input: PetInput) => request<Pet>('/pets', { method: 'POST', body: JSON.stringify(input) }),
    update: (id: string, input: Partial<PetInput>) =>
      request<Pet>(`/pets/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    delete: (id: string) => request<void>(`/pets/${id}`, { method: 'DELETE' }),
  },
  appointments: {
    list: () => request<Appointment[]>('/appointments'),
    create: (input: AppointmentInput) => request<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(input) }),
    update: (id: string, input: Partial<AppointmentInput>) =>
      request<Appointment>(`/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
    updateStatus: (id: string, status: AppointmentStatus) =>
      request<Appointment>(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  medicalRecords: {
    list: () => request<MedicalRecord[]>('/medical-records'),
    create: (input: MedicalRecordInput) =>
      request<MedicalRecord>('/medical-records', { method: 'POST', body: JSON.stringify(input) }),
  },
  inventory: {
    listItems: () => request<InventoryItem[]>('/inventory/items'),
    createItem: (input: InventoryItemInput) => request<InventoryItem>('/inventory/items', { method: 'POST', body: JSON.stringify(input) }),
    listMovements: (itemId?: string) => request<InventoryMovement[]>(`/inventory/movements${itemId ? `?itemId=${encodeURIComponent(itemId)}` : ''}`),
    registerMovement: (input: InventoryMovementInput) => request<InventoryMovement>('/inventory/movements', { method: 'POST', body: JSON.stringify(input) }),
  },
  treatments: {
    list: (petId?: string) => request<Treatment[]>(`/treatments${petId ? `?petId=${encodeURIComponent(petId)}` : ''}`),
    create: (input: TreatmentInput) => request<Treatment>('/treatments', { method: 'POST', body: JSON.stringify(input) }),
    addControl: (id: string, input: TreatmentControlInput) =>
      request<TreatmentControl>(`/treatments/${id}/controls`, { method: 'POST', body: JSON.stringify(input) }),
    updateStatus: (id: string, status: TreatmentStatus) =>
      request<Treatment>(`/treatments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};
