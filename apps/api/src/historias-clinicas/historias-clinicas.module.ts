import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotasModule } from '../mascotas/mascotas.module';
import { HistoriasClinicasServicio } from './aplicacion/historias-clinicas.servicio';
import { HistoriaClinicaOrm } from './infraestructura/historia-clinica.orm-entity';
import { HistoriaClinicaTypeOrmRepositorio } from './infraestructura/historia-clinica.typeorm-repositorio';
import { HistoriasClinicasController } from './infraestructura/historias-clinicas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoriaClinicaOrm]), MascotasModule],
  controllers: [HistoriasClinicasController],
  providers: [
    HistoriasClinicasServicio,
    { provide: 'HistoriaClinicaRepositorio', useClass: HistoriaClinicaTypeOrmRepositorio },
  ],
})
export class HistoriasClinicasModule {}
