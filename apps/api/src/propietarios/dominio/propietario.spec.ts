import { Propietario } from './propietario';

describe('Propietario', () => {
  const datos = {
    id: 'a66bdfad-0b10-4b4c-8d61-8c9acddab2c1',
    nombre: 'Laura',
    apellido: 'Gómez',
    documento: '123456789',
    correo: 'laura@example.com',
    telefono: '3001234567',
    direccion: null,
    creadoEn: new Date('2026-01-01T00:00:00.000Z'),
    actualizadoEn: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('creates an owner with valid data', () => {
    expect(Propietario.crear(datos).obtenerDatos()).toEqual(datos);
  });

  it('rejects an invalid email address', () => {
    expect(() => Propietario.crear({ ...datos, correo: 'invalid-email' })).toThrow('El correo electrónico no es válido');
  });

  it('rejects a missing document number', () => {
    expect(() => Propietario.crear({ ...datos, documento: ' ' })).toThrow('El documento es obligatorio');
  });
});
