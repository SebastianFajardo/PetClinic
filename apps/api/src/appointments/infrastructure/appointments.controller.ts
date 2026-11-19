import { Roles } from '../../authentication/infrastructure/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { AppointmentsService, CreateAppointment } from '../application/appointments.service';
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
  notes?: string;
}

class UpdateAppointmentDto {
  @IsOptional()
  @IsUUID()
  petId?: string;

  @IsOptional()
  @IsDateString()
  dateTime?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(240)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class UpdateAppointmentStatusDto {
  @IsIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'])
  status!: AppointmentStatus;
}

@Controller('appointments')
@Roles('admin', 'veterinarian', 'assistant', 'receptionist')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  create(@Body() input: CreateAppointmentDto) {
    return this.service.create(input);
  }

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.list(from, to);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() input: UpdateAppointmentDto) {
    return this.service.update(id, input);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() input: UpdateAppointmentStatusDto) {
    return this.service.updateStatus(id, input.status);
  }
}
