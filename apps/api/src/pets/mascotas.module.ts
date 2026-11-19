import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModule } from '../owners/owners.module';
import { PetsService } from './application/pets.service';
import { PetTypeOrmRepository } from './infrastructure/pet.typeorm-repository';
import { PetOrm } from './infrastructure/pet.orm-entity';
import { PetsController } from './infrastructure/pets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetOrm]), OwnersModule],
  controllers: [PetsController],
  providers: [
    PetsService,
    { provide: 'PetRepository', useClass: PetTypeOrmRepository },
  ],
  exports: ['PetRepository'],
})
export class PetsModule {}
