import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { IsIn, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Roles } from '../authentication/infrastructure/roles.decorator';
import { CreateInventoryItem, InventoryService, RegisterInventoryMovement } from './inventory.service';
import { InventoryMovementType } from './inventory.domain';

class CreateInventoryItemDto implements CreateInventoryItem {
  @IsString() @MinLength(2) @MaxLength(160) name!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() @MinLength(2) @MaxLength(100) category!: string;
  @IsString() @MinLength(1) @MaxLength(40) unit!: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100000000) minimumQuantity?: number;
}
class RegisterInventoryMovementDto implements RegisterInventoryMovement {
  @IsUUID() itemId!: string;
  @IsIn(['entry', 'exit', 'adjustment']) type!: InventoryMovementType;
  @IsNumber() @Min(0) @Max(100000000) quantity!: number;
  @IsString() @MinLength(3) @MaxLength(500) reason!: string;
}

@Controller('inventory')
@Roles('admin', 'veterinarian', 'assistant')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}
  @Get('items') listItems() { return this.service.listItems(); }
  @Post('items') @Roles('admin', 'assistant') createItem(@Body() input: CreateInventoryItemDto) { return this.service.createItem(input); }
  @Get('movements') listMovements(@Query('itemId', new ParseUUIDPipe({ optional: true })) itemId?: string) { return this.service.listMovements(itemId); }
  @Post('movements') @Roles('admin', 'assistant') registerMovement(@Body() input: RegisterInventoryMovementDto) { return this.service.registerMovement(input); }
}
