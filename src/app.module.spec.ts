import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Mock mongoose decorators
jest.mock('@nestjs/mongoose', () => {
  const originalModule = jest.requireActual('@nestjs/mongoose');
  return {
    ...originalModule,
    Prop: jest.fn(),
    Schema: jest.fn(),
    SchemaFactory: {
      createForClass: jest.fn(),
    },
    MongooseModule: {
      forRoot: jest.fn().mockReturnValue({
        module: class MongooseRootModule {},
        providers: [],
      }),
    },
  };
});

jest.mock('@nestjs/config', () => ({
  ConfigModule: {
    forRoot: jest.fn().mockReturnValue({
      module: class ConfigRootModule {},
      providers: [],
    }),
  },
}));

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module).toBeDefined();
    expect(MongooseModule.forRoot).toHaveBeenCalled();
    expect(ConfigModule.forRoot).toHaveBeenCalledWith({
      envFilePath: '.env',
      isGlobal: true,
    });
  });
});
