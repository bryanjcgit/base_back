import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export function handleCustomError(error: any): never {
  if (error.code === 'ER_DUP_ENTRY') {
    throw new BadRequestException('Ya existe este registro');
  }

  // Manejar error de "no encontrado" si proviene de algún servicio
  if (error instanceof NotFoundException) {
    throw error;  // Lanzar de nuevo si ya es una instancia de NotFoundException
  }

  // Si el error no coincide con los casos anteriores, es un error interno
  throw new InternalServerErrorException('Revisa los logs del servidor');
  
}