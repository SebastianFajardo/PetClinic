import { Controller, Get } from '@nestjs/common';
import { Publica } from '../../autenticacion/infrastructure/publica.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Publica()
  consultar(): { status: string; service: string } {
    return { status: 'ok', service: 'petclinic-api' };
  }
}
