import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { find } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'UserModel',
          useValue: {
            create: jest.fn().mockResolvedValue({
              save: jest.fn().mockResolvedValue({
                name: 'John Doe',
                email: '2q6W0@example.com',
                password: 'password',
                created_at: new Date(),
                updated_at: new Date(),
              }),
            }),
            find: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: '2q6W0@example.com',
              password: 'password',
              created_at: new Date(),
              updated_at: new Date(),
            }),
            findByIdAndUpdate: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: '2q6W0@example.com',
              password: 'password',
              created_at: new Date(),
              updated_at: new Date(),
            }),
            findByIdAndDelete: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: '2q6W0@example.com',
              password: 'password',
              created_at: new Date(),
              updated_at: new Date(),
            }),
            findOne: jest.fn().mockResolvedValue({
              name: 'John Doe',
              email: '2q6W0@example.com',
              password: 'password',
              created_at: new Date(),
              updated_at: new Date(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    const user = await service.create({
      name: 'John Doe',
      email: '2q6W0@example.com',
      password: 'password',
      created_at: new Date(),
      updated_at: new Date(),
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = await service.create({
      name: 'John Doe',
      email: '2q6W0@example.com',
      password: 'password',
      created_at: new Date(),
      updated_at: new Date(),
    })
    expect(user).toBeDefined();
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(users).toBeDefined();
  });

  it('should find one user', async () => {
    const user = await service.findOne('1');
    expect(user).toBeDefined();
  });

  it('should update a user', async () => {
    const user = await service.update('1', {
      name: 'John Doe',
      email: '2q6W0@example.com',
      password: 'password',
      created_at: new Date(), updated_at: new Date(),
    });
    expect(user).toBeDefined();
  });

  it('should remove a user', async () => {
    const user = await service.remove('1');
    expect(user).toBeDefined();
  });
});
