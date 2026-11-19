import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UsuarioOrm } from '../autenticacion/infraestructura/usuario.orm-entity';
import { CitaOrm } from '../citas/infraestructura/cita.orm-entity';
import { HistoriaClinicaOrm } from '../historias-clinicas/infraestructura/historia-clinica.orm-entity';
import { MascotaOrm } from '../mascotas/infraestructura/mascota.orm-entity';
import { PropietarioOrm } from '../propietarios/infraestructura/propietario.orm-entity';
import { CrearPropietariosYMascotas1731900000000 } from './migrations/1731900000000-CrearPropietariosYMascotas';
import { CrearHistoriasClinicasYCitas1731900000001 } from './migrations/1731900000001-CrearHistoriasClinicasYCitas';
import { CrearUsuarios1731900000002 } from './migrations/1731900000002-CrearUsuarios';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'petclinic',
  password: process.env.DATABASE_PASSWORD ?? 'petclinic',
  database: process.env.DATABASE_NAME ?? 'petclinic',
  entities: [UsuarioOrm, PropietarioOrm, MascotaOrm, HistoriaClinicaOrm, CitaOrm],
  migrations: [
    CrearPropietariosYMascotas1731900000000,
    CrearHistoriasClinicasYCitas1731900000001,
    CrearUsuarios1731900000002,
  ],
  synchronize: false,
});
