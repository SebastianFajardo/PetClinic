import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryItemOrm, InventoryMovementOrm } from './inventory.orm-entities';
import { InventoryTypeOrmRepository } from './inventory.typeorm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItemOrm, InventoryMovementOrm])],
  controllers: [InventoryController],
  providers: [InventoryService, { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository }],
})
export class InventoryModule {}
