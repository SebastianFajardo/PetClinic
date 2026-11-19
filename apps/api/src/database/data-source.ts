import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UsuarioOrm } from '../autenticacion/infrastructure/usuario.orm-entity';
import { AppointmentOrm } from '../appointments/infrastructure/appointment.orm-entity';
import { HistoriaClinicaOrm } from '../historias-clinicas/infrastructure/historia-clinica.orm-entity';
import { MascotaOrm } from '../mascotas/infrastructure/mascota.orm-entity';
import { PropietarioOrm } from '../propietarios/infrastructure/propietario.orm-entity';
import { CreateOwnersAndPets1731900000000 } from './migrations/1731900000000-CreateOwnersAndPets';
import { CrearHistoriasClinicasYAppointments1731900000001 } from './migrations/1731900000001-CrearHistoriasClinicasYAppointments';
import { CrearUsuarios1731900000002 } from './migrations/1731900000002-CrearUsuarios';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'petclinic',
  password: process.env.DATABASE_PASSWORD ?? 'petclinic',
  database: process.env.DATABASE_NAME ?? 'petclinic',
  entities: [UsuarioOrm, PropietarioOrm, MascotaOrm, HistoriaClinicaOrm, AppointmentOrm],
  migrations: [
    CreateOwnersAndPets1731900000000,
    CrearHistoriasClinicasYAppointments1731900000001,
    CrearUsuarios1731900000002,
  ],
  synchronize: false,
});
