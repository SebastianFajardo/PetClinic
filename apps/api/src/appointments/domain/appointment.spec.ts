import { Appointment } from './appointment';

describe('Appointment', () => {
  const datos = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    petId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    dateTime: new Date('2026-12-01T14:00:00.000Z'),
    durationMinutes: 30,
    reason: 'Control general',
    status: 'scheduled' as const,
    notes: null,
    createdAt: new Date('2026-11-01T00:00:00.000Z'),
    updatedAt: new Date('2026-11-01T00:00:00.000Z'),
  };

  it('creates an appointment with valid data', () => {
    expect(Appointment.create(datos).toData()).toEqual(datos);
  });

  it('rejects a duration outside the allowed range', () => {
    expect(() => Appointment.create({ ...datos, durationMinutes: 5 })).toThrow('La duración debe estar entre 15 y 240 minutos');
  });

  it('rejects an empty reason', () => {
    expect(() => Appointment.create({ ...datos, reason: ' ' })).toThrow('El reason de la appointment es obligatorio');
  });
});
