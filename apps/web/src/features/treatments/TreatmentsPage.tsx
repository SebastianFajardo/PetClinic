import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Pet, Treatment, TreatmentStatus } from '../../types';

const statusLabels: Record<TreatmentStatus, string> = {
  active: 'Activo',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

function dateLabel(value: string | null): string {
  if (!value) return '—';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
  return date.toLocaleDateString();
}

export function TreatmentsPage({ pets }: { pets: Pet[] }) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadTreatments() {
    try {
      setTreatments(await api.treatments.list());
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar los tratamientos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTreatments();
  }, []);

  async function createTreatment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.treatments.create({
        petId: String(form.get('petId')),
        veterinarianName: String(form.get('veterinarianName')),
        name: String(form.get('name')),
        description: String(form.get('description')),
        medication: String(form.get('medication')) || undefined,
        dosage: String(form.get('dosage')) || undefined,
        frequency: String(form.get('frequency')) || undefined,
        startDate: String(form.get('startDate')),
        endDate: String(form.get('endDate')) || undefined,
        nextControlAt: String(form.get('nextControlAt')) ? new Date(String(form.get('nextControlAt'))).toISOString() : undefined,
        notes: String(form.get('notes')) || undefined,
      });
      setShowForm(false);
      await loadTreatments();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible registrar el tratamiento');
    }
  }

  async function addControl(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.treatments.addControl(selectedTreatmentId, {
        controlDate: new Date(String(form.get('controlDate'))).toISOString(),
        observations: String(form.get('observations')),
        outcome: String(form.get('outcome')),
        nextControlAt: String(form.get('nextControlAt')) ? new Date(String(form.get('nextControlAt'))).toISOString() : undefined,
      });
      setSelectedTreatmentId('');
      await loadTreatments();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible registrar el control');
    }
  }

  async function updateStatus(id: string, status: TreatmentStatus) {
    try {
      await api.treatments.updateStatus(id, status);
      await loadTreatments();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible actualizar el tratamiento');
    }
  }

  const petNames = new Map(pets.map(pet => [pet.id, pet.name]));
  const selectedTreatment = treatments.find(treatment => treatment.id === selectedTreatmentId);

  return (
    <section className="content-card">
      <div className="section-heading">
        <div><h2>Tratamientos y controles</h2><p>{treatments.length} tratamientos registrados</p></div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)} disabled={pets.length === 0}>+ Nuevo tratamiento</button>
      </div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {pets.length === 0 && <p className="info-banner">Registra primero una mascota para asignar un tratamiento.</p>}
      {showForm && <form className="data-form" onSubmit={createTreatment}>
        <label>Mascota<select name="petId" required>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label>
        <label>Veterinario<input name="veterinarianName" required minLength={2} maxLength={160} /></label>
        <label>Nombre del tratamiento<input name="name" required minLength={2} maxLength={160} /></label>
        <label>Medicamento<input name="medication" maxLength={160} /></label>
        <label>Dosis<input name="dosage" maxLength={120} /></label>
        <label>Frecuencia<input name="frequency" maxLength={120} /></label>
        <label>Fecha de inicio<input name="startDate" type="date" required /></label>
        <label>Fecha de finalización<input name="endDate" type="date" /></label>
        <label>Próximo control<input name="nextControlAt" type="datetime-local" /></label>
        <label className="full-field">Descripción<input name="description" required minLength={2} /></label>
        <label className="full-field">Observaciones<textarea name="notes" rows={2} /></label>
        <div className="form-actions"><button className="primary-button" type="submit">Guardar tratamiento</button><button className="secondary-button" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
      </form>}
      {selectedTreatment && <form className="data-form" onSubmit={addControl}>
        <div className="full-field"><strong>Registrar control: {selectedTreatment.name}</strong></div>
        <label>Fecha del control<input name="controlDate" type="datetime-local" required /></label>
        <label>Próximo control<input name="nextControlAt" type="datetime-local" /></label>
        <label className="full-field">Observaciones<textarea name="observations" rows={2} required minLength={2} /></label>
        <label className="full-field">Resultado y recomendaciones<textarea name="outcome" rows={2} required minLength={2} /></label>
        <div className="form-actions"><button className="primary-button" type="submit">Guardar control</button><button className="secondary-button" type="button" onClick={() => setSelectedTreatmentId('')}>Cancelar</button></div>
      </form>}
      {loading ? <p className="table-empty">Cargando tratamientos...</p> : (
        <div className="table-wrap"><table><thead><tr><th>Mascota</th><th>Tratamiento</th><th>Medicamento</th><th>Inicio</th><th>Próximo control</th><th>Estado</th><th>Controles</th><th>Acciones</th></tr></thead><tbody>
          {treatments.map(treatment => <tr key={treatment.id}>
            <td><strong>{petNames.get(treatment.petId) ?? 'Mascota'}</strong></td>
            <td>{treatment.name}<small className="table-secondary">{treatment.veterinarianName}</small></td>
            <td>{treatment.medication ?? '—'}{treatment.dosage ? ` · ${treatment.dosage}` : ''}</td>
            <td>{dateLabel(treatment.startDate)}</td>
            <td>{dateLabel(treatment.nextControlAt)}</td>
            <td>{statusLabels[treatment.status]}</td>
            <td>{treatment.controls?.length ?? 0}</td>
            <td className="table-actions">
              {treatment.status === 'active' && <><button className="text-button" onClick={() => setSelectedTreatmentId(treatment.id)}>Registrar control</button><select aria-label="Estado del tratamiento" value={treatment.status} onChange={event => void updateStatus(treatment.id, event.target.value as TreatmentStatus)}><option value="active">Activo</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select></>}
            </td>
          </tr>)}
        </tbody></table>{!loading && treatments.length === 0 && <p className="table-empty">Todavía no hay tratamientos registrados.</p>}</div>
      )}
      {treatments.some(treatment => treatment.controls?.length) && <div className="content-card treatment-history">
        <div className="section-heading"><div><h2>Historial de controles</h2><p>Seguimiento registrado por tratamiento</p></div></div>
        {treatments.filter(treatment => treatment.controls?.length).map(treatment => <article className="control-entry" key={treatment.id}>
          <strong>{petNames.get(treatment.petId) ?? 'Mascota'} · {treatment.name}</strong>
          {treatment.controls.map(control => <div className="control-detail" key={control.id}>
            <span>{new Date(control.controlDate).toLocaleString()}</span>
            <p>{control.observations}</p>
            <p>{control.outcome}</p>
            {control.nextControlAt && <small>Próximo control: {new Date(control.nextControlAt).toLocaleString()}</small>}
          </div>)}
        </article>)}
      </div>}
    </section>
  );
}
