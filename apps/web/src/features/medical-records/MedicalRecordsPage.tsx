import { FormEvent, useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { MedicalRecord, Pet } from '../../types';

export function MedicalRecordsPage({ pets }: { pets: Pet[] }) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function loadRecords(petId = selectedPetId) {
    try {
      setRecords(await api.medicalRecords.list(petId || undefined));
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible cargar las historias clínicas');
    }
  }

  useEffect(() => {
    void loadRecords();
  }, [selectedPetId]);

  async function createRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSaving(true);
    setError('');
    try {
      await api.medicalRecords.create({
        petId: String(form.get('petId')),
        veterinarianName: String(form.get('veterinarian')).trim(),
        reason: String(form.get('reason')).trim(),
        symptoms: String(form.get('symptoms')).trim(),
        diagnosis: String(form.get('diagnosis')).trim(),
        treatment: String(form.get('treatment')).trim(),
        notes: String(form.get('notes')).trim(),
        recordedAt: new Date(String(form.get('recordedAt'))).toISOString(),
      });
      setShowForm(false);
      await loadRecords();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible registrar la historia clínica');
    } finally {
      setIsSaving(false);
    }
  }

  const petNames = new Map(pets.map(pet => [pet.id, pet.name]));

  return (
    <section className="content-card">
      <div className="section-heading">
        <div><h2>Historias clínicas</h2><p>{records.length} registros clínicos</p></div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)} disabled={pets.length === 0}>+ Nuevo registro</button>
      </div>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {pets.length === 0 && <p className="info-banner">Registra primero una mascota para crear su historia clínica.</p>}
      <div className="filter-row">
        <label>Filtrar por mascota<select value={selectedPetId} onChange={event => setSelectedPetId(event.target.value)}><option value="">Todas las mascotas</option>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label>
        <button className="secondary-button" type="button" onClick={() => void loadRecords()}>Actualizar</button>
      </div>
      {showForm && <form className="data-form" onSubmit={createRecord}>
        <label>Mascota<select name="petId" defaultValue={selectedPetId || pets[0]?.id} required>{pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label>
        <label>Fecha de consulta<input name="recordedAt" type="datetime-local" defaultValue={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} required /></label>
        <label>Veterinario<input name="veterinarian" required minLength={2} maxLength={160} /></label>
        <label className="full-field">Motivo de consulta<input name="reason" required minLength={2} maxLength={500} /></label>
        <label className="full-field">Síntomas<textarea name="symptoms" rows={2} required minLength={2} /></label>
        <label className="full-field">Diagnóstico<textarea name="diagnosis" rows={2} required minLength={2} /></label>
        <label className="full-field">Tratamiento<textarea name="treatment" rows={2} required minLength={2} /></label>
        <label className="full-field">Observaciones<textarea name="notes" rows={2} /></label>
        <div className="form-actions"><button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar historia clínica'}</button><button className="secondary-button" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
      </form>}
      <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Mascota</th><th>Veterinario</th><th>Motivo</th><th>Diagnóstico</th><th>Tratamiento</th></tr></thead><tbody>
        {records.map(record => <tr key={record.id}><td>{new Date(record.recordedAt).toLocaleString()}</td><td><strong>{petNames.get(record.petId) ?? 'Mascota'}</strong></td><td>{record.veterinarianName}</td><td>{record.reason}</td><td>{record.diagnosis}</td><td>{record.treatment}</td></tr>)}
      </tbody></table>{records.length === 0 && <p className="table-empty">No hay historias clínicas para los filtros seleccionados.</p>}</div>
      <p className="info-banner">Las historias clínicas se conservan como registros de auditoría. Para corregir información clínica, registra una nueva nota de seguimiento en lugar de borrar el antecedente original.</p>
    </section>
  );
}
