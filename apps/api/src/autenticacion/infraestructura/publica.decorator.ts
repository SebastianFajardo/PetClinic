import { SetMetadata } from '@nestjs/common';

export const RUTA_PUBLICA = 'ruta_publica';
export const Publica = () => SetMetadata(RUTA_PUBLICA, true);
