import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AutenticacionServicio } from '../aplicacion/autenticacion.servicio';
import { UsuarioActual } from './usuario-actual.decorator';
import { Publica } from './publica.decorator';
import { UsuarioAutenticado } from '../dominio/usuario';

class RegistrarUsuarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  nombre!: string;

  @IsEmail()
  @MaxLength(180)
  correo!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(72)
  contrasena!: string;
}

class IniciarSesionDto {
  @IsEmail()
  @MaxLength(180)
  correo!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  contrasena!: string;
}

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly servicio: AutenticacionServicio) {}

  @Post('register')
  @Publica()
  registrar(@Body() entrada: RegistrarUsuarioDto) {
    return this.servicio.registrar(entrada);
  }

  @Post('login')
  @Publica()
  iniciarSesion(@Body() entrada: IniciarSesionDto) {
    return this.servicio.iniciarSesion(entrada.correo, entrada.contrasena);
  }

  @Get('me')
  obtenerSesion(@UsuarioActual() usuario: UsuarioAutenticado) {
    return usuario;
  }
}
