import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module.js';
import {
  NestFastifyApplication,
  FastifyAdapter,
} from '@nestjs/platform-fastify';
import { applyGlobalConfig } from '../global-config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

jest.mock('./global-config', () => ({
  applyGlobalConfig: jest.fn(),
}));

describe('Bootstrap Function', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
  });

  it('should initialize the application with Fastify adapter', async () => {
    expect(app).toBeDefined();
    expect(app.getHttpAdapter().constructor.name).toBe('FastifyAdapter');
  });

  it('should apply global configuration', () => {
    expect(applyGlobalConfig).toHaveBeenCalledWith(app);
  });

  it('should configure Swagger correctly', () => {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('User Authentication and Management API')
      .setVersion('1.0')
      .addBearerAuth({
        description: 'Informar token JWT para autorizar o acesso',
        name: 'Authorization',
        scheme: 'bearer',
        type: 'http',
        in: 'header',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);
    expect(document).toBeDefined();
    expect(document.info.title).toBe('API');
    expect(document.info.description).toBe(
      'User Authentication and Management API'
    );
    expect(document.info.version).toBe('1.0');
    expect(document.components.securitySchemes).toHaveProperty('bearer');
  });

  it('should listen on the correct port', async () => {
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    const serverUrl = await app.getUrl();
    expect(serverUrl).toBe(`http://0.0.0.0:${port}`);
  });

  afterAll(async () => {
    await app.close();
  });
});
