import { Appointment } from './appointment';

describe('Appointment', () => {
  const data = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    petId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    dateTime: new Date('2026-12-01T14:00:00.000Z'),
    durationMinutes: 30,
    reason: 'General checkup',
    status: 'scheduled' as const,
    notes: null,
    createdAt: new Date('2026-11-01T00:00:00.000Z'),
    updatedAt: new Date('2026-11-01T00:00:00.000Z'),
  };

  it('creates an appointment with valid data', () => {
    expect(Appointment.create(data).toData()).toEqual(data);
  });

  it('rejects a duration outside the allowed range', () => {
    expect(() => Appointment.create({ ...data, durationMinutes: 5 })).toThrow('Duration must be between 15 and 240 minutes');
  });

  it('rejects an empty reason', () => {
    expect(() => Appointment.create({ ...data, reason: ' ' })).toThrow('The appointment reason is required');
  });
});
