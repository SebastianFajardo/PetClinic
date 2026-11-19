import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserOrm } from '../authentication/infrastructure/user.orm-entity';
import { AppointmentOrm } from '../appointments/infrastructure/appointment.orm-entity';
import { MedicalRecordOrm } from '../medical-records/infrastructure/medical-record.orm-entity';
import { PetOrm } from '../pets/infrastructure/pet.orm-entity';
import { OwnerOrm } from '../owners/infrastructure/owner.orm-entity';
import { TreatmentControlOrm } from '../treatments/infrastructure/treatment-control.orm-entity';
import { TreatmentOrm } from '../treatments/infrastructure/treatment.orm-entity';
import { CreateOwnersAndPets1731900000000 } from './migrations/1731900000000-CreateOwnersAndPets';
import { CreateMedicalRecordsAndAppointments1731900000001 } from './migrations/1731900000001-CreateMedicalRecordsAndAppointments';
import { CreateUsers1731900000002 } from './migrations/1731900000002-CreateUsers';
import { CreateTreatmentsAndControls1731900000003 } from './migrations/1731900000003-CreateTreatmentsAndControls';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'petclinic',
  password: process.env.DATABASE_PASSWORD ?? 'petclinic',
  database: process.env.DATABASE_NAME ?? 'petclinic',
  entities: [UserOrm, OwnerOrm, PetOrm, MedicalRecordOrm, AppointmentOrm, TreatmentOrm, TreatmentControlOrm],
  migrations: [
    CreateOwnersAndPets1731900000000,
    CreateMedicalRecordsAndAppointments1731900000001,
    CreateUsers1731900000002,
    CreateTreatmentsAndControls1731900000003,
  ],
  synchronize: false,
});
