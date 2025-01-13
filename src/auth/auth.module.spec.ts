import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

// Mock mongoose decorators
jest.mock('@nestjs/mongoose', () => {
  const originalModule = jest.requireActual('@nestjs/mongoose');
  return {
    ...originalModule,
    InjectModel: jest.fn(),
    Prop: jest.fn(),
    Schema: jest.fn(),
    SchemaFactory: {
      createForClass: jest.fn(),
    },
    MongooseModule: {
      forFeature: jest.fn().mockReturnValue({
        module: class MongooseFeatureModule {},
        providers: [],
      }),
    },
  };
});

jest.mock('@nestjs/passport', () => ({
  PassportModule: {
    register: jest.fn().mockReturnValue({
      module: class PassportRootModule {},
      providers: [],
    }),
  },
}));

jest.mock('@nestjs/jwt', () => ({
  JwtModule: {
    registerAsync: jest.fn().mockReturnValue({
      module: class JwtRootModule {},
      providers: [],
    }),
  },
}));

describe('AuthModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    expect(module).toBeDefined();
    expect(PassportModule.register).toHaveBeenCalledWith({
      defaultStrategy: 'jwt',
    });
    expect(JwtModule.registerAsync).toHaveBeenCalled();
    expect(MongooseModule.forFeature).toHaveBeenCalledWith([
      { name: 'User', schema: expect.any(Object) },
    ]);
  });
});
