import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { MedicalRecord, Pet } from '../../types';

export function MedicalRecordsPage({ pets }: { pets: Pet[] }) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  async function loadRecords() {
    try {
      setRecords(await api.medicalRecords.list());
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar las historias clínicas');
    }
  }

  useEffect(() => {
    void loadRecords();
  }, []);

  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api.medicalRecords.create({
        mascotaId: String(form.get('petId')),
        nombreVeterinario: String(form.get('veterinarian')),
        motivoConsulta: String(form.get('reason')),
        sintomas: String(form.get('symptoms')),
        diagnostico: String(form.get('diagnosis')),
        tratamiento: String(form.get('treatment')),
        observaciones: String(form.get('notes')),
      });
      setShowForm(false);
      await loadRecords();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible registrar la historia clínica');
    }
  }

  const petNames = new Map(pets.map(pet => [pet.id, pet.nombre]));

  return (
    <section className="content-card">
      <div className="section-heading">
        <div><h2>Historias clínicas</h2><p>{records.length} registros clínicos</p></div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)} disabled={pets.length === 0}>+ Nuevo registro</button>
      </div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {pets.length === 0 && <p className="info-banner">Registra primero una mascota para crear su historia clínica.</p>}
      {showForm && <form className="data-form" onSubmit={createRecord}>
        <label>Mascota<select name="petId" required>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.nombre}</option>)}</select></label>
        <label>Veterinario<input name="veterinarian" required maxLength={160} /></label>
        <label className="full-field">Motivo de consulta<input name="reason" required maxLength={500} /></label>
        <label className="full-field">Síntomas<textarea name="symptoms" rows={2} required /></label>
        <label className="full-field">Diagnóstico<textarea name="diagnosis" rows={2} required /></label>
        <label className="full-field">Tratamiento<textarea name="treatment" rows={2} required /></label>
        <label className="full-field">Observaciones<textarea name="notes" rows={2} /></label>
        <div className="form-actions"><button className="primary-button" type="submit">Guardar historia clínica</button><button className="secondary-button" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
      </form>}
      <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Mascota</th><th>Veterinario</th><th>Motivo</th><th>Diagnóstico</th><th>Tratamiento</th></tr></thead><tbody>
        {records.map(record => <tr key={record.id}><td>{new Date(record.registradaEn).toLocaleDateString()}</td><td><strong>{petNames.get(record.mascotaId) ?? 'Mascota'}</strong></td><td>{record.nombreVeterinario}</td><td>{record.motivoConsulta}</td><td>{record.diagnostico}</td><td>{record.tratamiento}</td></tr>)}
      </tbody></table>{records.length === 0 && <p className="table-empty">Todavía no hay historias clínicas registradas.</p>}</div>
    </section>
  );
}
