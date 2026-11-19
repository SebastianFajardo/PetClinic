export type RolUsuario = 'admin' | 'veterinarian' | 'assistant' | 'receptionist';

export interface DatosUsuario {
  id: string;
  nombre: string;
  correo: string;
  contrasenaHash: string;
  rol: RolUsuario;
  activo: boolean;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface UsuarioAutenticado {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

export function obtenerUsuarioAutenticado(datos: DatosUsuario): UsuarioAutenticado {
  return { id: datos.id, nombre: datos.nombre, correo: datos.correo, rol: datos.rol };
}
