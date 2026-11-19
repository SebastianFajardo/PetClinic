import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CrearMascota, MascotasServicio } from '../aplicacion/mascotas.servicio';

class CrearMascotaDto implements CrearMascota {
  @IsString()
  propietarioId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  nombre!: string;

  @IsIn(['dog', 'cat', 'bird', 'other'])
  especie!: 'dog' | 'cat' | 'bird' | 'other';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  raza?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  sexo?: 'male' | 'female' | 'unknown';

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
  notas?: string;
}

class ActualizarMascotaDto {
  @IsOptional()
  @IsString()
  propietarioId?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  nombre?: string;

  @IsOptional()
  @IsIn(['dog', 'cat', 'bird', 'other'])
  especie?: 'dog' | 'cat' | 'bird' | 'other';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  raza?: string;

  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'unknown'])
  sexo?: 'male' | 'female' | 'unknown';

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
  notas?: string;
}

@Controller('pets')
export class MascotasController {
  constructor(private readonly servicio: MascotasServicio) {}

  @Post()
  crear(@Body() entrada: CrearMascotaDto) {
    return this.servicio.crear(entrada);
  }

  @Get()
  listar(@Query('ownerId') propietarioId?: string) {
    return this.servicio.listar(propietarioId);
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtener(id);
  }

  @Patch(':id')
  actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() entrada: ActualizarMascotaDto) {
    return this.servicio.actualizar(id, entrada);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.servicio.eliminar(id);
  }
}
