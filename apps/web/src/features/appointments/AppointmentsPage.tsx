import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Appointment, Pet } from '../../types';

const statusLabels: Record<Appointment['estado'], string> = {
  scheduled: 'Programada',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

export function AppointmentsPage({ pets }: { pets: Pet[] }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  async function loadAppointments() {
    try {
      setAppointments(await api.appointments.list());
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar las citas');
    }
  }

  useEffect(() => {
    void loadAppointments();
  }, []);

  async function createAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.appointments.create({
        mascotaId: String(form.get('petId')),
        fechaHora: new Date(String(form.get('scheduledAt'))).toISOString(),
        duracionMinutos: Number(form.get('duration')),
        motivo: String(form.get('reason')),
        observaciones: String(form.get('notes')),
      });
      setShowForm(false);
      await loadAppointments();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible crear la cita');
    }
  }

  async function changeStatus(id: string, estado: Appointment['estado']) {
    try {
      await api.appointments.updateStatus(id, estado);
      await loadAppointments();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible actualizar la cita');
    }
  }

  const petNames = new Map(pets.map(pet => [pet.id, pet.name]));

  return (
    <section className="content-card">
      <div className="section-heading">
        <div><h2>Agenda de citas</h2><p>{appointments.length} citas registradas</p></div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)} disabled={pets.length === 0}>+ Nueva cita</button>
      </div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {pets.length === 0 && <p className="info-banner">Registra primero una mascota para programar una cita.</p>}
      {showForm && <form className="data-form" onSubmit={createAppointment}>
        <label>Mascota<select name="petId" required>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label>
        <label>Fecha y hora<input name="scheduledAt" type="datetime-local" required /></label>
        <label>Duración (minutos)<input name="duration" type="number" min="15" max="240" step="15" defaultValue="30" required /></label>
        <label>Motivo<input name="reason" required maxLength={500} /></label>
        <label className="full-field">Observaciones<textarea name="notes" rows={2} /></label>
        <div className="form-actions"><button className="primary-button" type="submit">Guardar cita</button><button className="secondary-button" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
      </form>}
      <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Mascota</th><th>Motivo</th><th>Duración</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
        {appointments.map(appointment => <tr key={appointment.id}>
          <td>{new Date(appointment.fechaHora).toLocaleString()}</td>
          <td><strong>{petNames.get(appointment.mascotaId) ?? 'Mascota'}</strong></td>
          <td>{appointment.motivo}</td>
          <td>{appointment.duracionMinutos} min</td>
          <td>{statusLabels[appointment.estado]}</td>
          <td>{['scheduled', 'confirmed'].includes(appointment.estado) && <select aria-label="Cambiar estado" value={appointment.estado} onChange={event => void changeStatus(appointment.id, event.target.value as Appointment['estado'])}>
            <option value="scheduled">Programada</option><option value="confirmed">Confirmada</option><option value="completed">Completada</option><option value="cancelled">Cancelada</option><option value="no_show">No asistió</option>
          </select>}</td>
        </tr>)}
      </tbody></table>{appointments.length === 0 && <p className="table-empty">Todavía no hay citas registradas.</p>}</div>
    </section>
  );
}
