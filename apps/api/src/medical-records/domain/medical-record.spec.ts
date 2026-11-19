import { MedicalRecord } from './medical-record';

describe('MedicalRecord', () => {
  const data = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    petId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    veterinarianName: 'Diana Rojas',
    reason: 'Control preventivo',
    symptoms: 'Sin síntomas reportados',
    diagnosis: 'Evaluación general sin hallazgos',
    treatment: 'Continuar controles preventivos',
    notes: null,
    recordedAt: new Date('2026-11-01T10:00:00.000Z'),
    createdAt: new Date('2026-11-01T10:00:00.000Z'),
  };

  it('creates a medical record with valid data', () => {
    expect(MedicalRecord.create(data).toData()).toEqual(data);
  });

  it('rejects a missing veterinarian name', () => {
    expect(() => MedicalRecord.create({ ...data, veterinarianName: ' ' })).toThrow('Veterinarian name is required');
  });

  it('rejects a missing diagnosis', () => {
    expect(() => MedicalRecord.create({ ...data, diagnosis: ' ' })).toThrow('Diagnosis is required');
  });
});
