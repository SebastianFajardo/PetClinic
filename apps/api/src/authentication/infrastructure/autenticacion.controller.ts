import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthenticationService } from '../application/authentication.servicio';
import { CurrentUser } from './user-actual.decorator';
import { Publica } from './publica.decorator';
import { UserAutenticado } from '../domain/user';

class RegisterUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsEmail()
  @MaxLength(180)
  email!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(72)
  password!: string;
}

class LoginDto {
  @IsEmail()
  @MaxLength(180)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password!: string;
}

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly servicio: AuthenticationService) {}

  @Post('register')
  @Publica()
  register(@Body() input: RegisterUserDto) {
    return this.servicio.register(input);
  }

  @Post('login')
  @Publica()
  login(@Body() input: LoginDto) {
    return this.servicio.login(input.email, input.password);
  }

  @Get('me')
  getSession(@CurrentUser() user: UserAutenticado) {
    return user;
  }
}
