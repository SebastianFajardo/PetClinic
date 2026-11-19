import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotasModule } from '../mascotas/mascotas.module';
import { AppointmentsService } from './application/appointments.service';
import { AppointmentOrm } from './infrastructure/appointment.orm-entity';
import { AppointmentTypeOrmRepositorio } from './infrastructure/appointment.typeorm-repository';
import { AppointmentsController } from './infrastructure/appointments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentOrm]), MascotasModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    { provide: 'AppointmentRepository', useClass: AppointmentTypeOrmRepositorio },
  ],
})
export class AppointmentsModule {}
