import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config.service';
import { EnvConfigModule } from '../../env-config.module';

describe('EnvConfigService unit tests', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return the value of the environment variable PORT', () => {
    const appPort = sut.getAppPort();
    expect(appPort).toBe(3000);
  });

  it('should return the value of the environment variable NODE_ENV', () => {
    const nodeEnv = sut.getNodeEnv();
    expect(nodeEnv).toBe('test');
  });

  it('should return the value of the environment variable JWT_SECRET', () => {
    const jwstSecret = sut.getJwtSecret();
    expect(jwstSecret).toBe('test_secret');
  });
  it('should return the value of the environment variable JWT_EXPIRES_IN', () => {
    const jwstSecret = sut.getJwtExpiresInSeconds();
    expect(jwstSecret).toBe(86400);
  });
});
