import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@common/enums/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>(Environment.SERVER_PORT) || 8080;

  await app.listen(port);
}

bootstrap();
