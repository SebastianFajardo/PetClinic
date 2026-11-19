import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotasModule } from '../mascotas/mascotas.module';
import { CitasServicio } from './aplicacion/citas.servicio';
import { CitaOrm } from './infraestructura/cita.orm-entity';
import { CitaTypeOrmRepositorio } from './infraestructura/cita.typeorm-repositorio';
import { CitasController } from './infraestructura/citas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CitaOrm]), MascotasModule],
  controllers: [CitasController],
  providers: [
    CitasServicio,
    { provide: 'CitaRepositorio', useClass: CitaTypeOrmRepositorio },
  ],
})
export class CitasModule {}
