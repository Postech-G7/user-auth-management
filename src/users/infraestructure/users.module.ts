import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../application/usecases/signup-users.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { HashProvider } from '../..//shared/application/providers/implementations/hash-provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { SigninUseCase } from '../application/usecases/signin-users.usecase';
import { GetUserUseCase } from '../application/usecases/get-user.usecase';
import { ListUsersUseCase } from '../application/usecases/list-users.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { UpdatePasswordUseCase } from '../application/usecases/update-password.usecase';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { PrismaService } from '../../shared/infraestructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository';
import { AuthModule } from '../../auth/infraestructure/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    { provide: 'PrismaService', useClass: PrismaService },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) =>
        new UserPrismaRepository(prismaService),
      inject: ['PrismaService'],
    },
    { provide: 'HashProvider', useClass: HashProvider },
    {
      provide: SignupUseCase.UseCase, //nome no container
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider
      ) => {
        return new SignupUseCase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider
      ) => {
        return new SigninUseCase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase.UseCase,
      useFactory: (
        userRepository: UserRepository.Repository,
        hashProvider: HashProvider
      ) => {
        return new UpdatePasswordUseCase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
