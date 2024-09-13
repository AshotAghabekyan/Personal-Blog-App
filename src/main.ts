import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './utils/filters/allExceptionFilter';
import { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port: number = configService.get("port");

  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(port, () => console.log("server run on %d port", port));
}
bootstrap();
