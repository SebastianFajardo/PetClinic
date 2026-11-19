import { DatosPropietario } from './propietario';

export interface PropietarioRepositorio {
  guardar(datos: DatosPropietario): Promise<DatosPropietario>;
  buscarPorId(id: string): Promise<DatosPropietario | null>;
  listar(): Promise<DatosPropietario[]>;
  eliminar(id: string): Promise<boolean>;
  existeDocumento(documento: string, excluirId?: string): Promise<boolean>;
  existeCorreo(correo: string, excluirId?: string): Promise<boolean>;
}
