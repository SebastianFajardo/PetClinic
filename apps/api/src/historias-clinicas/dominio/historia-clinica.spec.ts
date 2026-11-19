import { HistoriaClinica } from './historia-clinica';

describe('HistoriaClinica', () => {
  const datos = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    mascotaId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    nombreVeterinario: 'Diana Rojas',
    motivoConsulta: 'Control preventivo',
    sintomas: 'Sin síntomas reportados',
    diagnostico: 'Evaluación general sin hallazgos',
    tratamiento: 'Continuar controles preventivos',
    observaciones: null,
    registradaEn: new Date('2026-11-01T10:00:00.000Z'),
    creadaEn: new Date('2026-11-01T10:00:00.000Z'),
  };

  it('creates a medical record with valid data', () => {
    expect(HistoriaClinica.crear(datos).obtenerDatos()).toEqual(datos);
  });

  it('rejects a missing veterinarian name', () => {
    expect(() => HistoriaClinica.crear({ ...datos, nombreVeterinario: ' ' })).toThrow('El nombre del veterinario es obligatorio');
  });

  it('rejects a missing diagnosis', () => {
    expect(() => HistoriaClinica.crear({ ...datos, diagnostico: ' ' })).toThrow('El diagnóstico es obligatorio');
  });
});
