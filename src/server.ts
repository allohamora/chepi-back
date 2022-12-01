import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const APP_NAME = process.env.npm_package_name;
const APP_VERSION = process.env.npm_package_version;
const APP_PORT = 3000;

const SWAGGER_PATH = 'swagger';

export class Server {
  private constructor(private app: INestApplication) {}

  public addGlobalPrefix() {
    this.app.setGlobalPrefix('/api/v1');

    return this;
  }

  public addCors() {
    this.app.enableCors();

    return this;
  }

  public addPipes() {
    this.app.useGlobalPipes(new ValidationPipe({ transform: true }));

    return this;
  }

  public addSwagger() {
    const config = new DocumentBuilder()
      .setTitle(APP_NAME)
      .setDescription(`${APP_NAME} docs`)
      .setVersion(APP_VERSION)
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup(SWAGGER_PATH, this.app, document);

    return this;
  }

  public listen() {
    return this.app.listen(APP_PORT);
  }

  static async create() {
    const app = await NestFactory.create(AppModule);

    return new Server(app);
  }

  static async forProduction() {
    const server = await this.create();

    return server.addGlobalPrefix().addCors().addPipes().addSwagger();
  }
}
