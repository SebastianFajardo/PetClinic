import { Controller, Get } from '@nestjs/common';
import { Publica } from '../../autenticacion/infraestructura/publica.decorator';

@Controller('health')
export class EstadoController {
  @Get()
  @Publica()
  consultar(): { status: string; service: string } {
    return { status: 'ok', service: 'petclinic-api' };
  }
}
