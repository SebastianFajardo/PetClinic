import { Roles } from '../../autenticacion/infrastructure/roles.decorator';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CrearPet, PetsService } from '../application/pets.service';

class CrearPetDto implements CrearPet {
  @IsUUID()
  ownerId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsIn(['dog', 'cat', 'bird', 'other'])
  species!: 'dog' | 'cat' | 'bird' | 'other';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  sex?: 'male' | 'female' | 'unknown';

  @IsOptional()
  @IsString()
  @MaxLength(80)
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(500)
  pesoKg?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

class ActualizarPetDto {
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsIn(['dog', 'cat', 'bird', 'other'])
  species?: 'dog' | 'cat' | 'bird' | 'other';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  sex?: 'male' | 'female' | 'unknown';

  @IsOptional()
  @IsString()
  @MaxLength(80)
  color?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(500)
  pesoKg?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

@Controller('pets')
@Roles('admin', 'veterinarian', 'assistant', 'receptionist')
export class PetsController {
  constructor(private readonly service: PetsService) {}

  @Post()
  create(@Body() input: CrearPetDto) {
    return this.service.create(input);
  }

  @Get()
  list(@Query('ownerId') ownerId?: string) {
    return this.service.list(ownerId);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() input: ActualizarPetDto) {
    return this.service.update(id, input);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }
}
