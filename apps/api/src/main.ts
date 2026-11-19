import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessRuleFilter } from './shared/infrastructure/business-rule.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configuration = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new BusinessRuleFilter());
  const port = Number(configuration.get<string>('API_PORT', '3000'));
  await app.listen(port);
}

void bootstrap();
