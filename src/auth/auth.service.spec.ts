import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              save: jest.fn().mockResolvedValue(dto),
            })),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('signed-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user and return a user and a token', async () => {
    const signupDto = {
      name: 'John Doe',
      email: 'tBx2T@example.com',
      password: 'password',
    };
    userModel.create.mockResolvedValue({ ...signupDto, save: jest.fn().mockResolvedValue({ ...signupDto }) });
    const result = await service.signUp(signupDto);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
  });

  it('should login a user and return a user and a token', async () => {
    const loginDto = {
      email: 'tBx2T@example.com',
      password: 'password',
    };
    userModel.findOne.mockResolvedValue(loginDto);
    const result = await service.login(loginDto);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
  });
});

