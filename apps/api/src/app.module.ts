import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoController } from './estado/infraestructura/estado.controller';
import { MascotasModule } from './mascotas/mascotas.module';
import { PropietariosModule } from './propietarios/propietarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configuracion: ConfigService) => ({
        type: 'postgres' as const,
        host: configuracion.get<string>('DATABASE_HOST', 'localhost'),
        port: Number(configuracion.get<string>('DATABASE_PORT', '5432')),
        username: configuracion.get<string>('DATABASE_USER', 'petclinic'),
        password: configuracion.get<string>('DATABASE_PASSWORD', 'petclinic'),
        database: configuracion.get<string>('DATABASE_NAME', 'petclinic'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    PropietariosModule,
    MascotasModule,
  ],
  controllers: [EstadoController],
})
export class AppModule {}
