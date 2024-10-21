import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  ); 
  app.enableCors();  
  
  
  const config = new DocumentBuilder()
    .setTitle('Servidor de pruebas')
    .setDescription('Encontrarás todas las APIs que usa el servidor para las pruebas')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
 
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
 
  const server = app.getHttpServer();
  const address = server.address().address === '0.0.0.0' ? 'localhost' : server.address().address;
  
  
  logger.log(`App corriendo en: http://${address}:${port}/api`);
  logger.log(`Swagger docs en: http://${address}:${port}/docs`);
}
bootstrap();
