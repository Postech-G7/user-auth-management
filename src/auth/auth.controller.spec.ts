import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'UserModel',
          useValue: {}, // mock UserModel
        },
        {
          provide: JwtService,
          useValue: {}, // mock JwtService
        },
        {
          provide: ConfigService,
          useValue: {}, // mock ConfigService
        }
      ],
    }).compile();
  
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});