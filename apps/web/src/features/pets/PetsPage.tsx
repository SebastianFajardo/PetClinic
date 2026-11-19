import { FormEvent, useState } from 'react';
import { api } from '../../services/api';
import type { Owner, Pet, PetInput } from '../../types';

export function PetsPage({ pets, owners, onChanged }: { pets: Pet[]; owners: Owner[]; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState<Pet | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const weight = String(form.get('weight')).trim();
    const input: PetInput = {
      ownerId: String(form.get('ownerId')),
      name: String(form.get('name')).trim(),
      species: String(form.get('species')) as Pet['species'],
      breed: String(form.get('breed')).trim(),
      birthDate: String(form.get('birthDate')) || undefined,
      sex: String(form.get('sex')) as Pet['sex'],
      color: String(form.get('color')).trim(),
      weightKg: weight ? Number(weight) : undefined,
      notes: String(form.get('notes')).trim(),
    };
    setSaving(true);
    setError('');
    try {
      if (editing) await api.pets.update(editing.id, input);
      else await api.pets.create(input);
      setEditing(null);
      setCreating(false);
      await onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible guardar la mascota');
    } finally {
      setSaving(false);
    }
  }

  async function remove(pet: Pet) {
    if (!window.confirm(`¿Eliminar a ${pet.name}?`)) return;
    setError('');
    try {
      await api.pets.delete(pet.id);
      await onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible eliminar la mascota. Puede tener citas o registros asociados.');
    }
  }

  const active = editing ?? (creating ? null : undefined);
  const ownerNames = new Map(owners.map(owner => [owner.id, `${owner.name} ${owner.lastName}`]));
  const speciesLabels: Record<Pet['species'], string> = { dog: 'Perro', cat: 'Gato', bird: 'Ave', other: 'Otro' };

  return <section className="content-card">
    <div className="section-heading"><div><h2>Pacientes</h2><p>{pets.length} mascotas registradas</p></div><button className="primary-button" onClick={() => { setEditing(null); setCreating(value => !value); setError(''); }} disabled={owners.length === 0}>{creating ? 'Cancelar' : '+ Nueva mascota'}</button></div>
    {owners.length === 0 && <p className="info-banner">Registra primero un propietario para poder asociar una mascota.</p>}
    {error && <div className="error-banner" role="alert">{error}</div>}
    {active !== undefined && <form className="data-form" onSubmit={submit}>
      <label>Propietario<select name="ownerId" required defaultValue={editing?.ownerId ?? owners[0]?.id}>{owners.map(owner => <option key={owner.id} value={owner.id}>{owner.name} {owner.lastName}</option>)}</select></label>
      <label>Nombre<input name="name" defaultValue={editing?.name ?? ''} required maxLength={120} /></label>
      <label>Especie<select name="species" defaultValue={editing?.species ?? 'dog'}><option value="dog">Perro</option><option value="cat">Gato</option><option value="bird">Ave</option><option value="other">Otro</option></select></label>
      <label>Raza<input name="breed" defaultValue={editing?.breed ?? ''} maxLength={100} /></label>
      <label>Fecha de nacimiento<input name="birthDate" type="date" defaultValue={editing?.birthDate?.slice(0, 10) ?? ''} /></label>
      <label>Sexo<select name="sex" defaultValue={editing?.sex ?? 'unknown'}><option value="unknown">Sin especificar</option><option value="male">Macho</option><option value="female">Hembra</option></select></label>
      <label>Color<input name="color" defaultValue={editing?.color ?? ''} maxLength={80} /></label>
      <label>Peso (kg)<input name="weight" type="number" min="0.01" max="500" step="0.01" defaultValue={editing?.weightKg ?? ''} /></label>
      <label className="full-field">Notas<textarea name="notes" rows={3} defaultValue={editing?.notes ?? ''} /></label>
      <div className="form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar mascota' : 'Guardar mascota'}</button><button className="secondary-button" type="button" onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</button></div>
    </form>}
    <div className="table-wrap"><table><thead><tr><th>Mascota</th><th>Especie</th><th>Raza</th><th>Propietario</th><th>Peso</th><th>Acciones</th></tr></thead><tbody>
      {pets.map(pet => <tr key={pet.id}><td><strong>{pet.name}</strong></td><td>{speciesLabels[pet.species]}</td><td>{pet.breed ?? '—'}</td><td>{ownerNames.get(pet.ownerId) ?? '—'}</td><td>{pet.weightKg ? `${pet.weightKg} kg` : '—'}</td><td><div className="form-actions"><button className="secondary-button" onClick={() => { setCreating(false); setEditing(pet); setError(''); }}>Editar</button><button className="secondary-button" onClick={() => void remove(pet)}>Eliminar</button></div></td></tr>)}
    </tbody></table>{pets.length === 0 && <p className="table-empty">Todavía no hay mascotas registradas.</p>}</div>
  </section>;
}
