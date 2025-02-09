import { UserModelMapper } from 'src/users/infraestructure/database/prisma/models/user-model.mapper';
import { UserEntity } from '../../../../../domain/entities/user.entity';
import { ValidationError } from '../../../../../../shared/domain/errors/validation-error';

describe('UserModelMapper', () => {
  describe('toEntity', () => {
    it('should map a valid Prisma model to a UserEntity', () => {
      const mockPrismaModel = {
        id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
      };

      const entity = UserModelMapper.toEntity(mockPrismaModel);

      expect(entity).toBeInstanceOf(UserEntity);
      expect(entity.id).toBe('123');
      expect(entity.name).toBe('John Doe');
      expect(entity.email).toBe('john.doe@example.com');
      expect(entity.password).toBe('hashed-password');
      expect(entity.createdAt).toEqual(mockPrismaModel.createdAt);
    });

    it('should throw ValidationError if the entity creation fails', () => {
      const invalidPrismaModel = {
        id: '123',
        name: '', // Invalid name (empty string)
        email: 'invalid-email',
        password: 'hashed-password',
        createdAt: new Date(),
      };

      expect(() => UserModelMapper.toEntity(invalidPrismaModel)).toThrow(
        ValidationError
      );
    });
  });

  describe('toPrisma', () => {
    it('should map a UserEntity to a Prisma model', () => {
      const mockEntity = new UserEntity(
        {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
        '456'
      );

      const prismaModel = UserModelMapper.toPrisma(mockEntity);

      expect(prismaModel).toEqual({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'hashed-password',
        createdAt: mockEntity.createdAt,
      });
    });
  });
});
