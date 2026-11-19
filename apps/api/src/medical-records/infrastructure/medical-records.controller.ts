import { Roles } from '../../autenticacion/infrastructure/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CrearMedicalRecord, MedicalRecordsService } from '../application/medical-records.service';

class CrearMedicalRecordDto implements CrearMedicalRecord {
  @IsUUID()
  petId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  nombreVeterinario!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  motivoConsulta!: string;

  @IsString()
  @MinLength(2)
  sintomas!: string;

  @IsString()
  @MinLength(2)
  diagnosis!: string;

  @IsString()
  @MinLength(2)
  treatment!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}

@Controller('medical-records')
@Roles('admin', 'veterinarian')
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Post()
  create(@Body() input: CrearMedicalRecordDto) {
    return this.service.create(input);
  }

  @Get()
  list(@Query('petId') petId?: string) {
    return this.service.list(petId);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }
}
