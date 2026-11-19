import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReglaNegocioFiltro } from './compartido/infraestructura/regla-negocio.filtro';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configuracion = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new ReglaNegocioFiltro());
  const puerto = Number(configuracion.get<string>('API_PORT', '3000'));
  await app.listen(puerto);
}

void bootstrap();
