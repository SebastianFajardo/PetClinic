import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { TreatmentsService } from './application/treatments.service';
import { TreatmentControlOrm } from './infrastructure/treatment-control.orm-entity';
import { TreatmentOrm } from './infrastructure/treatment.orm-entity';
import { TreatmentTypeOrmRepository } from './infrastructure/treatment.typeorm-repository';
import { TreatmentsController } from './infrastructure/treatments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentOrm, TreatmentControlOrm]), PetsModule],
  controllers: [TreatmentsController],
  providers: [
    TreatmentsService,
    { provide: 'TreatmentRepository', useClass: TreatmentTypeOrmRepository },
  ],
})
export class TreatmentsModule {}
