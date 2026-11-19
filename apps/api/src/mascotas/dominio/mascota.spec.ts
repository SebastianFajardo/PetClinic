import { Mascota } from './mascota';

describe('Mascota', () => {
  const datos = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    propietarioId: 'b66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    nombre: 'Luna',
    especie: 'cat' as const,
    raza: null,
    fechaNacimiento: null,
    sexo: 'female' as const,
    color: 'Blanco',
    pesoKg: 4.2,
    notas: null,
    creadoEn: new Date('2026-01-01T00:00:00.000Z'),
    actualizadoEn: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('creates a pet with valid data', () => {
    expect(Mascota.crear(datos).obtenerDatos()).toEqual(datos);
  });

  it('rejects a non-positive weight', () => {
    expect(() => Mascota.crear({ ...datos, pesoKg: 0 })).toThrow('El peso debe ser un número mayor que cero');
  });
});
