export interface DatosPropietario {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  correo: string;
  telefono: string;
  direccion: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export class Propietario {
  private constructor(private readonly datos: DatosPropietario) {}

  static crear(datos: DatosPropietario): Propietario {
    if (!datos.nombre.trim() || !datos.apellido.trim()) {
      throw new Error('El nombre y el apellido son obligatorios');
    }
    if (!datos.documento.trim()) {
      throw new Error('El documento es obligatorio');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
      throw new Error('El correo electrónico no es válido');
    }
    if (!datos.telefono.trim()) {
      throw new Error('El teléfono es obligatorio');
    }
    return new Propietario(datos);
  }

  obtenerDatos(): DatosPropietario {
    return { ...this.datos };
  }
}
