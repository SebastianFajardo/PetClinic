import { FormEvent, useState } from 'react';
import { api } from '../../services/api';
import type { Owner, OwnerInput } from '../../types';

export function OwnersPage({ owners, onChanged }: { owners: Owner[]; onChanged: () => Promise<void> }) {
  const [editing, setEditing] = useState<Owner | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input: OwnerInput = {
      name: String(form.get('name')).trim(),
      lastName: String(form.get('lastName')).trim(),
      documentNumber: String(form.get('documentNumber')).trim(),
      email: String(form.get('email')).trim(),
      phone: String(form.get('phone')).trim(),
      address: String(form.get('address')).trim(),
    };
    setSaving(true);
    setError('');
    try {
      if (editing) await api.owners.update(editing.id, input);
      else await api.owners.create(input);
      setEditing(null);
      setCreating(false);
      await onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible guardar el propietario');
    } finally {
      setSaving(false);
    }
  }

  async function remove(owner: Owner) {
    if (!window.confirm(`¿Eliminar al propietario ${owner.name} ${owner.lastName}?`)) return;
    setError('');
    try {
      await api.owners.delete(owner.id);
      await onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible eliminar el propietario. Verifica si tiene mascotas asociadas.');
    }
  }

  const active = editing ?? (creating ? null : undefined);

  return <section className="content-card">
    <div className="section-heading"><div><h2>Directorio de propietarios</h2><p>{owners.length} propietarios registrados</p></div><button className="primary-button" onClick={() => { setEditing(null); setCreating(value => !value); setError(''); }}>{creating ? 'Cancelar' : '+ Nuevo propietario'}</button></div>
    {error && <div className="error-banner" role="alert">{error}</div>}
    {active !== undefined && <form className="data-form" onSubmit={submit}>
      <label>Nombres<input name="name" defaultValue={editing?.name ?? ''} required minLength={2} maxLength={100} /></label>
      <label>Apellidos<input name="lastName" defaultValue={editing?.lastName ?? ''} required minLength={2} maxLength={100} /></label>
      <label>Documento<input name="documentNumber" defaultValue={editing?.documentNumber ?? ''} required minLength={3} maxLength={30} /></label>
      <label>Correo electrónico<input name="email" type="email" defaultValue={editing?.email ?? ''} required maxLength={180} /></label>
      <label>Teléfono<input name="phone" defaultValue={editing?.phone ?? ''} required minLength={7} maxLength={30} /></label>
      <label>Dirección<input name="address" defaultValue={editing?.address ?? ''} maxLength={250} /></label>
      <div className="form-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando...' : editing ? 'Actualizar propietario' : 'Guardar propietario'}</button><button className="secondary-button" type="button" onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</button></div>
    </form>}
    <div className="table-wrap"><table><thead><tr><th>Propietario</th><th>Documento</th><th>Correo</th><th>Teléfono</th><th>Acciones</th></tr></thead><tbody>
      {owners.map(owner => <tr key={owner.id}><td><strong>{owner.name} {owner.lastName}</strong></td><td>{owner.documentNumber}</td><td>{owner.email}</td><td>{owner.phone}</td><td><div className="form-actions"><button className="secondary-button" onClick={() => { setCreating(false); setEditing(owner); setError(''); }}>Editar</button><button className="secondary-button" onClick={() => void remove(owner)}>Eliminar</button></div></td></tr>)}
    </tbody></table>{owners.length === 0 && <p className="table-empty">Todavía no hay propietarios registrados.</p>}</div>
  </section>;
}
