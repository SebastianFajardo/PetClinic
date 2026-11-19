import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacionServicio } from './aplicacion/autenticacion.servicio';
import { UsuarioOrm } from './infraestructura/usuario.orm-entity';
import { UsuarioTypeOrmRepositorio } from './infraestructura/usuario.typeorm-repositorio';
import { AutenticacionController } from './infraestructura/autenticacion.controller';
import { AccesoJwtGuard } from './infraestructura/guards/acceso-jwt.guard';
import { RolesGuard } from './infraestructura/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioOrm]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configuracion: ConfigService) => ({
        secret: configuracion.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: configuracion.get<string>('JWT_EXPIRES_IN', '1h') as '1h' },
      }),
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionServicio, UsuarioTypeOrmRepositorio, AccesoJwtGuard, RolesGuard],
  exports: [AccesoJwtGuard, RolesGuard],
})
export class AutenticacionModule {}
