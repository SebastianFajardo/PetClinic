import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtAuthGuard } from './authentication/infrastructure/guards/acceso-jwt.guard';
import { RolesGuard } from './authentication/infrastructure/guards/roles.guard';
import { CitasModule } from './citas/citas.module';
import { EstadoController } from './estado/infrastructure/estado.controller';
import { HistoriasClinicasModule } from './historias-clinicas/historias-clinicas.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { PropietariosModule } from './propietarios/propietarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        resolve(__dirname, '../../../.env'),
        resolve(__dirname, '../.env'),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configuration: ConfigService) => ({
        type: 'postgres' as const,
        host: configuration.get<string>('DATABASE_HOST', 'localhost'),
        port: Number(configuration.get<string>('DATABASE_PORT', '5432')),
        username: configuration.get<string>('DATABASE_USER', 'petclinic'),
        password: configuration.get<string>('DATABASE_PASSWORD', 'petclinic'),
        database: configuration.get<string>('DATABASE_NAME', 'petclinic'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    AuthenticationModule,
    PropietariosModule,
    MascotasModule,
    HistoriasClinicasModule,
    CitasModule,
  ],
  controllers: [EstadoController],
  providers: [
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
    { provide: APP_GUARD, useExisting: RolesGuard },
  ],
})
export class AppModule {}
