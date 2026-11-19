import { Roles } from '../../autenticacion/infrastructure/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CrearMedicalRecord, HistoriasClinicasServicio } from '../application/medical-records.service';

class CrearMedicalRecordDto implements CrearMedicalRecord {
  @IsUUID()
  mascotaId!: string;

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
  diagnostico!: string;

  @IsString()
  @MinLength(2)
  tratamiento!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsDateString()
  registradaEn?: string;
}

@Controller('medical-records')
@Roles('admin', 'veterinarian')
export class MedicalRecordsController {
  constructor(private readonly service: HistoriasClinicasServicio) {}

  @Post()
  create(@Body() input: CrearMedicalRecordDto) {
    return this.service.create(input);
  }

  @Get()
  list(@Query('petId') mascotaId?: string) {
    return this.service.list(mascotaId);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }
}
