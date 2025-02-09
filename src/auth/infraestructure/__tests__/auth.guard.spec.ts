import { Test } from '@nestjs/testing';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceMock: any;

  beforeEach(async () => {
    // Mock do AuthService
    authServiceMock = {
      verifyJwt: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  describe('canActivate', () => {
    it('should return true for a valid token', async () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      };
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      authServiceMock.verifyJwt.mockResolvedValue({ userId: '123' });

      // Act
      const result = await authGuard.canActivate(mockExecutionContext);

      // Assert
      expect(authServiceMock.verifyJwt).toHaveBeenCalledWith('valid-token');
      expect(mockRequest['user']).toEqual({ userId: '123' });
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      // Arrange
      const mockRequest = {
        headers: {},
      };
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      // Act & Assert
      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException for an invalid token', async () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      authServiceMock.verifyJwt.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if the authorization header is malformed', async () => {
      // Arrange
      const mockRequest = {
        headers: {
          authorization: 'InvalidHeaderFormat',
        },
      };
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;

      // Act & Assert
      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
