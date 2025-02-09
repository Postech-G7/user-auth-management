import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { EnvConfigModule } from '../shared/infraestructure/env-config/env-config.module';
import { UsersModule } from '../users/infraestructure/users.module';
import { DatabaseModule } from '../shared/infraestructure/database/database.module';
import { AuthModule } from '../auth/infraestructure/auth.module';

describe('AppModule', () => {
  it('should compile the AppModule', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AppModule)).toBeInstanceOf(AppModule);
  });

  it('should import all required modules', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Verifica se os módulos estão presentes no contexto
    expect(module.get(EnvConfigModule)).toBeInstanceOf(EnvConfigModule);
    expect(module.get(UsersModule)).toBeInstanceOf(UsersModule);
    expect(module.get(DatabaseModule)).toBeInstanceOf(DatabaseModule);
    expect(module.get(AuthModule)).toBeInstanceOf(AuthModule);
  });
});
