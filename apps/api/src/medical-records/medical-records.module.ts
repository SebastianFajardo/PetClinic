import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { MedicalRecordsService } from './application/medical-records.service';
import { MedicalRecordOrm } from './infrastructure/medical-record.orm-entity';
import { MedicalRecordTypeOrmRepository } from './infrastructure/medical-record.typeorm-repository';
import { MedicalRecordsController } from './infrastructure/medical-records.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecordOrm]), PetsModule],
  controllers: [MedicalRecordsController],
  providers: [
    MedicalRecordsService,
    { provide: 'MedicalRecordRepository', useClass: MedicalRecordTypeOrmRepository },
  ],
})
export class MedicalRecordsModule {}
