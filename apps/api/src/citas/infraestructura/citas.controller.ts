import { Roles } from '../../autenticacion/infraestructura/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CitasServicio, CrearCita } from '../aplicacion/citas.servicio';
import { EstadoCita } from '../dominio/cita';

class CrearCitaDto implements CrearCita {
  @IsUUID()
  mascotaId!: string;

  @IsDateString()
  fechaHora!: string;

  @IsInt()
  @Min(15)
  @Max(240)
  duracionMinutos!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  motivo!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

class CambiarEstadoCitaDto {
  @IsIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'])
  estado!: EstadoCita;
}

@Controller('appointments')
@Roles('admin', 'veterinarian', 'assistant', 'receptionist')
export class CitasController {
  constructor(private readonly servicio: CitasServicio) {}

  @Post()
  crear(@Body() entrada: CrearCitaDto) {
    return this.servicio.crear(entrada);
  }

  @Get()
  listar(@Query('from') desde?: string, @Query('to') hasta?: string) {
    return this.servicio.listar(desde, hasta);
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtener(id);
  }

  @Patch(':id/status')
  cambiarEstado(@Param('id', ParseUUIDPipe) id: string, @Body() entrada: CambiarEstadoCitaDto) {
    return this.servicio.cambiarEstado(id, entrada.estado);
  }
}
