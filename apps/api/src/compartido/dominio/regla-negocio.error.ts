export class ReglaNegocioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReglaNegocioError';
  }
}
