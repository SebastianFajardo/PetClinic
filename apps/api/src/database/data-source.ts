import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserOrm } from '../authentication/infrastructure/usuario.orm-entity';
import { AppointmentOrm } from '../appointments/infrastructure/appointment.orm-entity';
import { MedicalRecordOrm } from '../medical-records/infrastructure/historia-clinica.orm-entity';
import { PetOrm } from '../pets/infrastructure/mascota.orm-entity';
import { OwnerOrm } from '../owners/infrastructure/owner.orm-entity';
import { CreateOwnersAndPets1731900000000 } from './migrations/1731900000000-CreateOwnersAndPets';
import { CrearHistoriasClinicasYAppointments1731900000001 } from './migrations/1731900000001-CrearHistoriasClinicasYAppointments';
import { CreateUsers1731900000002 } from './migrations/1731900000002-CreateUsers';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'petclinic',
  password: process.env.DATABASE_PASSWORD ?? 'petclinic',
  database: process.env.DATABASE_NAME ?? 'petclinic',
  entities: [UserOrm, OwnerOrm, PetOrm, MedicalRecordOrm, AppointmentOrm],
  migrations: [
    CreateOwnersAndPets1731900000000,
    CrearHistoriasClinicasYAppointments1731900000001,
    CreateUsers1731900000002,
  ],
  synchronize: false,
});
