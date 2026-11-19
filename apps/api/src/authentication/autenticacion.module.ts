import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './application/authentication.servicio';
import { UserOrm } from './infrastructure/user.orm-entity';
import { UserTypeOrmRepository } from './infrastructure/user.typeorm-repositorio';
import { AuthenticationController } from './infrastructure/authentication.controller';
import { JwtAuthGuard } from './infrastructure/guards/acceso-jwt.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrm]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configuration: ConfigService) => ({
        secret: configuration.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: configuration.get<string>('JWT_EXPIRES_IN', '1h') as '1h' },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserTypeOrmRepository, JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthenticationModule {}
