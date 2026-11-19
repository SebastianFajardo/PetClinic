import { Roles } from '../../autenticacion/infrastructure/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { AppointmentsServicio, CreateAppointment } from '../aplicacion/appointments.servicio';
import { AppointmentStatus } from '../domain/appointment';

class CreateAppointmentDto implements CreateAppointment {
  @IsUUID()
  petId!: string;

  @IsDateString()
  dateTime!: string;

  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes!: number;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  reason!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

class CambiarAppointmentStatusDto {
  @IsIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'])
  status!: AppointmentStatus;
}

@Controller('appointments')
@Roles('admin', 'veterinarian', 'assistant', 'receptionist')
export class AppointmentsController {
  constructor(private readonly servicio: AppointmentsServicio) {}

  @Post()
  create(@Body() input: CreateAppointmentDto) {
    return this.servicio.create(input);
  }

  @Get()
  list(@Query('from') desde?: string, @Query('to') hasta?: string) {
    return this.servicio.list(desde, hasta);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.getById(id);
  }

  @Patch(':id/status')
  cambiarEstado(@Param('id', ParseUUIDPipe) id: string, @Body() input: CambiarAppointmentStatusDto) {
    return this.servicio.cambiarEstado(id, input.status);
  }
}
