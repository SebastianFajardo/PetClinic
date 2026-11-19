import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { JwtAuthGuard } from './authentication/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './authentication/infrastructure/guards/roles.guard';
import { AppointmentsModule } from './appointments/appointments.module';
import { HealthController } from './health/infrastructure/health.controller';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { PetsModule } from './pets/pets.module';
import { OwnersModule } from './owners/owners.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { InventoryModule } from './inventory/inventory.module';

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
    OwnersModule,
    PetsModule,
    MedicalRecordsModule,
    AppointmentsModule,
    TreatmentsModule,
    InventoryModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useExisting: JwtAuthGuard },
    { provide: APP_GUARD, useExisting: RolesGuard },
  ],
})
export class AppModule {}
