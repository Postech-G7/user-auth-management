import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
            findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Test User' }]),
            findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
            update: jest.fn().mockResolvedValue({ id: '1', name: 'Updated User' }),
            remove: jest.fn().mockResolvedValue({ id: '1', name: 'Deleted User' }),
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

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = { name: 'Test User' };
    const result = await controller.create(createUserDto);
    expect(result).toEqual({ id: '1', name: 'Test User' });
    expect(service.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should return an array of users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: '1', name: 'Test User' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual({ id: '1', name: 'Test User' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { name: 'Updated User' };
    const result = await controller.update('1', updateUserDto);
    expect(result).toEqual({ id: '1', name: 'Updated User' });
    expect(service.update).toHaveBeenCalledWith('1', updateUserDto);
  });

  it('should delete a user', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ id: '1', name: 'Deleted User' });
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});