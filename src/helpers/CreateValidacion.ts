import { HttpException, HttpStatus } from '@nestjs/common';

export class NumeracionVigenteException extends HttpException {
  constructor(numeracionesVigentes: any[]) {
    super(
      `Ya cuenta con una numeración${numeracionesVigentes.map(n => `(${n.numeracion}`).join(', ')}. ¿Desea registrarla de igual manera?`,
      HttpStatus.CONFLICT,
    );
  }
}