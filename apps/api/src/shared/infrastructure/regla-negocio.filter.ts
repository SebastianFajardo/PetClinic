import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { BusinessRuleError } from '../domain/business-rule.error';

@Catch(BusinessRuleError)
export class BusinessRuleFilter implements ExceptionFilter {
  catch(exception: BusinessRuleError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: exception.message,
      error: 'Business Rule Violation',
    });
  }
}
