import { Treatment, TreatmentControl } from './treatment';

describe('Treatment', () => {
  const now = new Date('2026-11-19T10:00:00.000Z');
  const treatment = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    petId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    medicalRecordId: null,
    veterinarianName: 'Dr. Smith',
    name: 'Antibiotic treatment',
    description: 'Treat respiratory infection',
    medication: 'Medication A',
    dosage: '5 ml',
    frequency: 'Every 12 hours',
    startDate: now,
    endDate: null,
    status: 'active' as const,
    nextControlAt: null,
    notes: null,
    controls: [],
    createdAt: now,
    updatedAt: now,
  };

  it('creates a treatment with valid data', () => {
    expect(Treatment.create(treatment).toData()).toEqual(treatment);
  });

  it('rejects an end date before the start date', () => {
    expect(() => Treatment.create({ ...treatment, endDate: new Date('2026-11-18T10:00:00.000Z') }))
      .toThrow('The treatment end date must be after its start date');
  });

  it('rejects an empty treatment name', () => {
    expect(() => Treatment.create({ ...treatment, name: ' ' })).toThrow('Treatment name is required');
  });
});

describe('TreatmentControl', () => {
  it('creates a control with valid data', () => {
    const date = new Date('2026-11-20T10:00:00.000Z');
    const control = {
      id: 'c66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
      treatmentId: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
      controlDate: date,
      observations: 'The symptoms have decreased',
      outcome: 'Continue the treatment',
      nextControlAt: null,
      createdAt: date,
    };
    expect(TreatmentControl.create(control).toData()).toEqual(control);
  });

  it('rejects a control without observations', () => {
    const date = new Date('2026-11-20T10:00:00.000Z');
    expect(() => TreatmentControl.create({
      id: 'c66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
      treatmentId: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
      controlDate: date,
      observations: ' ',
      outcome: 'Continue the treatment',
      nextControlAt: null,
      createdAt: date,
    })).toThrow('Control observations are required');
  });
});
