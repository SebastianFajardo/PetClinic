import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { Roles } from '../../authentication/infrastructure/roles.decorator';
import { CreateTreatment, CreateTreatmentControl, TreatmentsService } from '../application/treatments.service';
import { TreatmentStatus } from '../domain/treatment';

class CreateTreatmentDto implements CreateTreatment {
  @IsUUID()
  petId!: string;

  @IsOptional()
  @IsUUID()
  medicalRecordId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  veterinarianName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsString()
  @MinLength(2)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  medication?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  dosage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  frequency?: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsDateString()
  nextControlAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class CreateTreatmentControlDto implements CreateTreatmentControl {
  @IsDateString()
  controlDate!: string;

  @IsString()
  @MinLength(2)
  observations!: string;

  @IsString()
  @MinLength(2)
  outcome!: string;

  @IsOptional()
  @IsDateString()
  nextControlAt?: string;
}

class UpdateTreatmentStatusDto {
  @IsIn(['active', 'completed', 'cancelled'])
  status!: TreatmentStatus;
}

@Controller('treatments')
@Roles('admin', 'veterinarian', 'assistant')
export class TreatmentsController {
  constructor(private readonly service: TreatmentsService) {}

  @Post()
  create(@Body() input: CreateTreatmentDto) {
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

  @Post(':id/controls')
  addControl(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: CreateTreatmentControlDto,
  ) {
    return this.service.addControl(id, input);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateTreatmentStatusDto,
  ) {
    return this.service.updateStatus(id, input.status);
  }
}
