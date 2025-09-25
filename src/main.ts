import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';
import { TransformResponseInterceptor } from './common/interceptors/response-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001', // URL de tu frontend
    credentials: true,               // si envías cookies o tokens
  });

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
    } 
  ));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
