import { Roles } from '../../authentication/infrastructure/roles.decorator';
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CrearOwner, OwnersService } from '../application/owners.servicio';

class CrearOwnerDto implements CrearOwner {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellido!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  documento!: string;

  @IsEmail()
  @MaxLength(180)
  correo!: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  telefono!: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  direccion?: string;
}

class ActualizarOwnerDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  apellido?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  documento?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(180)
  correo?: string;

  @IsOptional()
  @IsString()
  @MinLength(7)
  @MaxLength(30)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  direccion?: string;
}

@Controller('owners')
@Roles('admin', 'veterinarian', 'assistant', 'receptionist')
export class OwnersController {
  constructor(private readonly servicio: OwnersService) {}

  @Post()
  crear(@Body() entrada: CrearOwnerDto) {
    return this.servicio.crear(entrada);
  }

  @Get()
  listar() {
    return this.servicio.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicio.obtener(id);
  }

  @Patch(':id')
  actualizar(@Param('id', ParseUUIDPipe) id: string, @Body() entrada: ActualizarOwnerDto) {
    return this.servicio.actualizar(id, entrada);
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.servicio.eliminar(id);
  }
}
