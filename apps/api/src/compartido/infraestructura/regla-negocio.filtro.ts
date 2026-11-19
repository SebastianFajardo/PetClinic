import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ReglaNegocioError } from '../dominio/regla-negocio.error';

@Catch(ReglaNegocioError)
export class ReglaNegocioFiltro implements ExceptionFilter {
  catch(exception: ReglaNegocioError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Business Rule Violation',
    });
  }
}
