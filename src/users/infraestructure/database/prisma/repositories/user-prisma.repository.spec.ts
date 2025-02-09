import { PrismaService } from '../../../../../shared/infraestructure/database/prisma/prisma.service';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserPrismaRepository } from './user-prisma.repository';
import { UserModelMapper } from '../models/user-model.mapper';
import { NotFoundError } from 'src/shared/domain/errors/not-found-error';
import { ConflictError } from 'src/shared/domain/errors/conflict-error';

jest.mock('../models/user-model.mapper');

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;
  let prismaServiceMock: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
  };

  beforeEach(() => {
    prismaServiceMock = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    repository = new UserPrismaRepository(prismaServiceMock);
  });

  describe('findByEmail', () => {
    it('should return a UserEntity when the email exists', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('john.doe@example.com');

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com' },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toBe('john.doe@example.com');
    });

    it('should throw NotFoundError when the email does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        repository.findByEmail('nonexistent@example.com')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('emailExists', () => {
    it('should throw ConflictError when the email already exists', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        repository.emailExists('john.doe@example.com')
      ).rejects.toThrow(ConflictError);
    });

    it('should not throw an error when the email does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        repository.emailExists('nonexistent@example.com')
      ).resolves.not.toThrow();
    });
  });

  describe('search', () => {
    it('should return search results with pagination and sorting', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
      ];

      prismaServiceMock.user.count.mockResolvedValue(2);
      prismaServiceMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await repository.search({
        page: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'Doe',
      });

      expect(prismaServiceMock.user.count).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'Doe',
            mode: 'insensitive',
          },
        },
      });
      expect(prismaServiceMock.user.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'Doe',
            mode: 'insensitive',
          },
        },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
      });
      expect(result.items.length).toBe(2);
      expect(result.total).toBe(2);
      expect(result.currentPage).toBe(1);
      expect(result.perPage).toBe(10);
    });
  });

  describe('insert', () => {
    it('should insert a new user into the database', async () => {
      const entity = new UserEntity(
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
        '1'
      );

      await repository.insert(entity);

      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashed-password',
          createdAt: entity.createdAt,
        },
      });
    });
  });

  describe('update', () => {
    it('should update an existing user in the database', async () => {
      const entity = new UserEntity(
        {
          name: 'John Doe Updated',
          email: 'john.doe@example.com',
          password: 'new-hashed-password',
          createdAt: new Date(),
        },
        '1'
      );

      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      await repository.update(entity);

      expect(prismaServiceMock.user.update).toHaveBeenCalledWith({
        data: {
          name: 'John Doe Updated',
          email: 'john.doe@example.com',
          password: 'new-hashed-password',
          createdAt: entity.createdAt,
        },
        where: { id: 1 },
      });
    });

    it('should throw NotFoundError if the user does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      const entity = new UserEntity(
        {
          name: 'John Doe Updated',
          email: 'john.doe@example.com',
          password: 'new-hashed-password',
          createdAt: new Date(),
        },
        '1'
      );

      await expect(repository.update(entity)).rejects.toThrow(NotFoundError);
    });
  });

  describe('findById', () => {
    it('should return a UserEntity when the ID exists', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findById('1');

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundError when the ID does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(repository.findById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('findAll', () => {
    it('should return all users as UserEntity instances', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
        {
          id: 2,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
      ];

      prismaServiceMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await repository.findAll();

      expect(prismaServiceMock.user.findMany).toHaveBeenCalled();
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(UserEntity);
      expect(result[1]).toBeInstanceOf(UserEntity);
    });
  });

  describe('delete', () => {
    it('should delete an existing user', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser);

      await repository.delete('1');

      expect(prismaServiceMock.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundError if the user does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(repository.delete('999')).rejects.toThrow(NotFoundError);
    });
  });
});
