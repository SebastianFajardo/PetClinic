import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { AppointmentsService } from './application/appointments.service';
import { AppointmentOrm } from './infrastructure/appointment.orm-entity';
import { AppointmentTypeOrmRepository } from './infrastructure/appointment.typeorm-repository';
import { AppointmentsController } from './infrastructure/appointments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentOrm]), PetsModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    { provide: 'AppointmentRepository', useClass: AppointmentTypeOrmRepository },
  ],
})
export class AppointmentsModule {}
