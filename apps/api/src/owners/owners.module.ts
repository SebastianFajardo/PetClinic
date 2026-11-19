import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersService } from './application/owners.service';
import { OwnerTypeOrmRepository } from './infrastructure/owner.typeorm-repository';
import { OwnerOrm } from './infrastructure/owner.orm-entity';
import { OwnersController } from './infrastructure/owners.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OwnerOrm])],
  controllers: [OwnersController],
  providers: [
    OwnersService,
    { provide: 'OwnerRepository', useClass: OwnerTypeOrmRepository },
  ],
  exports: ['OwnerRepository'],
})
export class OwnersModule {}
