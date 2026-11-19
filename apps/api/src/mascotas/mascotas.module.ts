import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropietariosModule } from '../propietarios/propietarios.module';
import { MascotasServicio } from './aplicacion/mascotas.servicio';
import { MascotaTypeOrmRepositorio } from './infraestructura/mascota.typeorm-repositorio';
import { MascotaOrm } from './infraestructura/mascota.orm-entity';
import { MascotasController } from './infraestructura/mascotas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MascotaOrm]), PropietariosModule],
  controllers: [MascotasController],
  providers: [
    MascotasServicio,
    { provide: 'MascotaRepositorio', useClass: MascotaTypeOrmRepositorio },
  ],
})
export class MascotasModule {}
