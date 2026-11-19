import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE = 'ruta_publica';
export const Public = () => SetMetadata(PUBLIC_ROUTE, true);
