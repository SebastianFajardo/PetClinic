import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropietariosServicio } from './aplicacion/propietarios.servicio';
import { PropietarioTypeOrmRepositorio } from './infraestructura/propietario.typeorm-repositorio';
import { PropietarioOrm } from './infraestructura/propietario.orm-entity';
import { PropietariosController } from './infraestructura/propietarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropietarioOrm])],
  controllers: [PropietariosController],
  providers: [
    PropietariosServicio,
    { provide: 'PropietarioRepositorio', useClass: PropietarioTypeOrmRepositorio },
  ],
  exports: ['PropietarioRepositorio'],
})
export class PropietariosModule {}
