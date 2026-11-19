import { Controller, Get } from '@nestjs/common';
import { Public } from '../../authentication/infrastructure/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  check(): { status: string; service: string } {
    return { status: 'ok', service: 'petclinic-api' };
  }
}
