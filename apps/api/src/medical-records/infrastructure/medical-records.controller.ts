import { Roles } from '../../authentication/infrastructure/roles.decorator';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CreateMedicalRecord, MedicalRecordsService } from '../application/medical-records.service';

class CreateMedicalRecordDto implements CreateMedicalRecord {
  @IsUUID()
  petId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  veterinarianName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  reason!: string;

  @IsString()
  @MinLength(2)
  symptoms!: string;

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
  create(@Body() input: CreateMedicalRecordDto) {
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
