import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthenticationService } from '../application/authentication.service';
import { CurrentUser } from './current-user.decorator';
import { Public } from './public.decorator';
import { AuthenticatedUser } from '../domain/user';

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
  constructor(private readonly service: AuthenticationService) {}

  @Post('register')
  @Public()
  register(@Body() input: RegisterUserDto) {
    return this.service.register(input);
  }

  @Post('login')
  @Public()
  login(@Body() input: LoginDto) {
    return this.service.login(input.email, input.password);
  }

  @Get('me')
  getSession(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }
}
