import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import type { Appointment, InventoryItem, MedicalRecord, Owner, Pet, Treatment } from '../../types';

type ReportData = {
  owners: Owner[];
  pets: Pet[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  treatments: Treatment[];
  inventoryItems: InventoryItem[];
};

const appointmentLabels: Record<Appointment['status'], string> = {
  scheduled: 'Programadas',
  confirmed: 'Confirmadas',
  completed: 'Completadas',
  cancelled: 'Canceladas',
  no_show: 'No asistió',
};

const speciesLabels: Record<Pet['species'], string> = {
  dog: 'Perros',
  cat: 'Gatos',
  bird: 'Aves',
  other: 'Otros',
};

function countBy<T extends string>(values: T[], value: T): number {
  return values.filter(item => item === value).length;
}

export function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadReports() {
    setLoading(true);
    setError('');
    try {
      const [owners, pets, appointments, medicalRecords, treatments, inventoryItems] = await Promise.all([
        api.owners.list(),
        api.pets.list(),
        api.appointments.list(),
        api.medicalRecords.list(),
        api.treatments.list(),
        api.inventory.listItems(),
      ]);
      setData({ owners, pets, appointments, medicalRecords, treatments, inventoryItems });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible generar los reportes');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  if (loading) return <section className="content-card"><p className="table-empty">Generando reportes...</p></section>;
  if (error || !data) return <section className="content-card"><div className="error-banner" role="alert">{error || 'No hay información disponible para generar los reportes.'}</div><button className="primary-button" onClick={() => void loadReports()}>Reintentar</button></section>;

  const lowStockItems = data.inventoryItems.filter(item => item.isActive && item.quantity <= item.minimumQuantity);
  const activeTreatments = data.treatments.filter(treatment => treatment.status === 'active');
  const upcomingAppointments = data.appointments.filter(appointment =>
    ['scheduled', 'confirmed'].includes(appointment.status) && new Date(appointment.dateTime).getTime() >= Date.now(),
  );
  const species = (Object.keys(speciesLabels) as Pet['species'][]).map(key => ({
    key,
    label: speciesLabels[key],
    total: countBy(data.pets.map(pet => pet.species), key),
  }));
  const appointmentStatuses = (Object.keys(appointmentLabels) as Appointment['status'][]).map(status => ({
    status,
    label: appointmentLabels[status],
    total: countBy(data.appointments.map(appointment => appointment.status), status),
  }));
  const petNames = new Map(data.pets.map(pet => [pet.id, pet.name]));

  return <section className="reports-page">
    <div className="section-heading">
      <div><h2>Indicadores generales</h2><p>Resumen calculado a partir de los registros actuales del sistema</p></div>
      <button className="secondary-button" onClick={() => void loadReports()}>↻ Actualizar reportes</button>
    </div>
    <div className="reports-grid">
      <article className="stat-card"><span>Propietarios</span><strong>{data.owners.length}</strong><small>Registrados</small></article>
      <article className="stat-card"><span>Mascotas</span><strong>{data.pets.length}</strong><small>Pacientes registrados</small></article>
      <article className="stat-card"><span>Citas</span><strong>{data.appointments.length}</strong><small>{upcomingAppointments.length} próximas o pendientes</small></article>
      <article className="stat-card"><span>Historias clínicas</span><strong>{data.medicalRecords.length}</strong><small>Registros clínicos</small></article>
      <article className="stat-card"><span>Tratamientos activos</span><strong>{activeTreatments.length}</strong><small>De {data.treatments.length} tratamientos</small></article>
      <article className="stat-card"><span>Productos con stock bajo</span><strong>{lowStockItems.length}</strong><small>De {data.inventoryItems.filter(item => item.isActive).length} productos activos</small></article>
    </div>

    <div className="reports-columns">
      <section className="content-card report-card">
        <div className="section-heading"><div><h2>Mascotas por especie</h2><p>Distribución de pacientes registrados</p></div></div>
        <div className="report-list">
          {species.map(item => <div className="report-row" key={item.key}><span>{item.label}</span><strong>{item.total}</strong></div>)}
        </div>
      </section>
      <section className="content-card report-card">
        <div className="section-heading"><div><h2>Estado de las citas</h2><p>Distribución por estado actual</p></div></div>
        <div className="report-list">
          {appointmentStatuses.map(item => <div className="report-row" key={item.status}><span>{item.label}</span><strong>{item.total}</strong></div>)}
        </div>
      </section>
    </div>

    <section className="content-card report-card">
      <div className="section-heading"><div><h2>Próximas citas</h2><p>Citas programadas y confirmadas pendientes de atención</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Fecha</th><th>Mascota</th><th>Motivo</th><th>Estado</th></tr></thead><tbody>
        {upcomingAppointments.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()).slice(0, 10).map(appointment => <tr key={appointment.id}>
          <td>{new Date(appointment.dateTime).toLocaleString('es-CO')}</td>
          <td><strong>{petNames.get(appointment.petId) ?? 'Mascota'}</strong></td>
          <td>{appointment.reason}</td>
          <td>{appointmentLabels[appointment.status]}</td>
        </tr>)}
      </tbody></table>{upcomingAppointments.length === 0 && <p className="table-empty">No hay próximas citas pendientes.</p>}</div>
    </section>

    <section className="content-card report-card">
      <div className="section-heading"><div><h2>Productos que requieren reposición</h2><p>Existencias iguales o inferiores al stock mínimo</p></div></div>
      <div className="table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Existencia</th><th>Stock mínimo</th></tr></thead><tbody>
        {lowStockItems.map(item => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.category}</td><td>{item.quantity} {item.unit}</td><td>{item.minimumQuantity} {item.unit}</td></tr>)}
      </tbody></table>{lowStockItems.length === 0 && <p className="table-empty">No hay productos que requieran reposición.</p>}</div>
    </section>
    <p className="report-disclaimer">Los indicadores se calculan en tiempo real con los datos disponibles. No representan cifras históricas ni proyecciones.</p>
  </section>;
}
