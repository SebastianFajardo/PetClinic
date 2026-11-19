import { Cita } from './cita';

describe('Cita', () => {
  const datos = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    mascotaId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    fechaHora: new Date('2026-12-01T14:00:00.000Z'),
    duracionMinutos: 30,
    motivo: 'Control general',
    estado: 'scheduled' as const,
    observaciones: null,
    creadaEn: new Date('2026-11-01T00:00:00.000Z'),
    actualizadaEn: new Date('2026-11-01T00:00:00.000Z'),
  };

  it('creates an appointment with valid data', () => {
    expect(Cita.crear(datos).obtenerDatos()).toEqual(datos);
  });

  it('rejects a duration outside the allowed range', () => {
    expect(() => Cita.crear({ ...datos, duracionMinutos: 5 })).toThrow('La duración debe estar entre 15 y 240 minutos');
  });

  it('rejects an empty reason', () => {
    expect(() => Cita.crear({ ...datos, motivo: ' ' })).toThrow('El motivo de la cita es obligatorio');
  });
});
