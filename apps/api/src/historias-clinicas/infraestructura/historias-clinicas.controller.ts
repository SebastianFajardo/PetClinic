import { Roles } from '../../autenticacion/infraestructura/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CrearHistoriaClinica, HistoriasClinicasServicio } from '../aplicacion/historias-clinicas.servicio';

class CrearHistoriaClinicaDto implements CrearHistoriaClinica {
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
export class HistoriasClinicasController {
  constructor(private readonly servicio: HistoriasClinicasServicio) {}

  @Post()
  crear(@Body() entrada: CrearHistoriaClinicaDto) {
    return this.servicio.crear(entrada);
  }

  @Get()
  listar(@Query('petId') mascotaId?: string) {
    return this.servicio.listar(mascotaId);
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtener(id);
  }
}
