import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
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
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with signup dto', async () => {
      const signupDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { id: 1, email: signupDto.email };
      mockAuthService.signUp.mockResolvedValue(expectedResult);

      const result = await controller.signUp(signupDto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(signupDto);
      expect(result).toBe(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with login dto', async () => {
      const loginDto: SignupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { access_token: 'token123' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(expectedResult);
    });
  });
});