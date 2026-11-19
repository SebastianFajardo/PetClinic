import type { Owner, OwnerInput, Pet, PetInput } from '../types';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string | string[] } | null;
    const message = Array.isArray(payload?.message) ? payload.message.join(', ') : payload?.message;
    throw new Error(message ?? 'No fue posible completar la solicitud');
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>('/health'),
  owners: {
    list: () => request<Owner[]>('/owners'),
    create: (input: OwnerInput) => request<Owner>('/owners', { method: 'POST', body: JSON.stringify(input) }),
  },
  pets: {
    list: () => request<Pet[]>('/pets'),
    create: (input: PetInput) => request<Pet>('/pets', { method: 'POST', body: JSON.stringify(input) }),
  },
};
