import { WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';

export function createWsException(validationErrors: ValidationError[] = []) {
  const errorMessage = Object.values(validationErrors[0]?.constraints || {})[0];
  return new WsException(errorMessage);
}
