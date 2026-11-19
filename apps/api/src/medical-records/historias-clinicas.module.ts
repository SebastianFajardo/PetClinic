import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotasModule } from '../mascotas/mascotas.module';
import { MedicalRecordsService } from './application/medical-records.service';
import { MedicalRecordOrm } from './infrastructure/medical-record.orm-entity';
import { MedicalRecordTypeOrmRepositorio } from './infrastructure/medical-record.typeorm-repository';
import { HistoriasClinicasController } from './infrastructure/medical-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecordOrm]), MascotasModule],
  controllers: [HistoriasClinicasController],
  providers: [
    MedicalRecordsService,
    { provide: 'MedicalRecordRepository', useClass: MedicalRecordTypeOrmRepositorio },
  ],
})
export class MedicalRecordsModule {}
