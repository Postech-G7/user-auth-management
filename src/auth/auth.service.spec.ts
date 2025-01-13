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
              id: 'test-id',
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

  describe('signUp', () => {
    it('should sign up a user and return user and token', async () => {
      const signupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.signUp(signupDto);

      expect(userModel.create).toHaveBeenCalledWith(signupDto);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 'test-id' },
        {
          secret: 'test-secret',
          expiresIn: 'test-secret',
        },
      );
      expect(result).toEqual({
        user: expect.objectContaining(signupDto),
        token: 'signed-token',
      });
    });

    it('should handle signup failure', async () => {
      const signupDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      userModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.signUp(signupDto)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    it('should login a user and return user and token when credentials are valid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 'test-id',
        ...loginDto,
      };

      userModel.findOne.mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 'test-id' },
        {
          secret: 'test-secret',
          expiresIn: 'test-secret',
        },
      );
      expect(result).toEqual({
        user,
        token: 'signed-token',
      });
    });

    it('should throw error when user is not found', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('User not found');
    });

    it('should throw error when password is invalid', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 'test-id',
        email: loginDto.email,
        password: 'correctpassword',
      };

      userModel.findOne.mockResolvedValue(user);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid password');
    });
  });
});
