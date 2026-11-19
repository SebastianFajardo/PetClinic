import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class EstadoController {
  @Get()
  consultar(): { status: string; service: string } {
    return { status: 'ok', service: 'petclinic-api' };
  }
}
