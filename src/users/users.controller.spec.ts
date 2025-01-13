import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Document, Types } from 'mongoose';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    _id: new Types.ObjectId(),
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    created_at: new Date(),
    updated_at: new Date(),
    __v: 0,
    $assertPopulated: jest.fn(),
    $clearModifiedPaths: jest.fn(),
    $clone: jest.fn(),
  } as unknown as Document<unknown, object, User> &
    User & { _id: Types.ObjectId } & { __v: number };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockUser);

      expect(await controller.create(createUserDto)).toBe(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers);

      expect(await controller.findAll()).toBe(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      expect(await controller.findOne('1')).toBe(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'John Doe Updated',
        email: 'john@example.com',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockUser);

      expect(await controller.update('1', updateUserDto)).toBe(mockUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(mockUser);

      expect(await controller.remove('1')).toBe(mockUser);
    });
  });
});
