import { Test } from '@nestjs/testing';
import { UsersModule } from '../users.module';
import { PrismaService } from 'src/shared/infraestructure/database/prisma/prisma.service';
import { UserPrismaRepository } from '../database/prisma/repositories/user-prisma.repository';
import { SignupUseCase } from 'src/users/application/usecases/signup-users.usecase';
import { SigninUseCase } from 'src/users/application/usecases/signin-users.usecase';
import { GetUserUseCase } from 'src/users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from 'src/users/application/usecases/list-users.usecase';
import { UpdateUserUseCase } from 'src/users/application/usecases/update-user.usecase';
import { UpdatePasswordUseCase } from 'src/users/application/usecases/update-password.usecase';
import { DeleteUserUseCase } from 'src/users/application/usecases/delete-user.usecase';
import { HashProvider } from 'src/shared/application/providers/implementations/hash-provider';

describe('UsersModule', () => {
  it('should compile the module and provide all dependencies', async () => {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    expect(module).toBeDefined();

    // Verifica se todos os provedores estão disponíveis no contexto
    const prismaService = module.get<PrismaService>('PrismaService');
    const userRepository = module.get<UserPrismaRepository>('UserRepository');
    const hashProvider = module.get<HashProvider>('HashProvider');

    expect(prismaService).toBeInstanceOf(PrismaService);
    expect(userRepository).toBeInstanceOf(UserPrismaRepository);
    expect(hashProvider).toBeInstanceOf(HashProvider);

    // Verifica se os casos de uso estão disponíveis no contexto
    const signupUseCase = module.get<SignupUseCase.UseCase>(
      SignupUseCase.UseCase
    );
    const signinUseCase = module.get<SigninUseCase.UseCase>(
      SigninUseCase.UseCase
    );
    const getUserUseCase = module.get<GetUserUseCase.UseCase>(
      GetUserUseCase.UseCase
    );
    const listUsersUseCase = module.get<ListUsersUseCase.UseCase>(
      ListUsersUseCase.UseCase
    );
    const updateUserUseCase = module.get<UpdateUserUseCase.UseCase>(
      UpdateUserUseCase.UseCase
    );
    const updatePasswordUseCase = module.get<UpdatePasswordUseCase.UseCase>(
      UpdatePasswordUseCase.UseCase
    );
    const deleteUserUseCase = module.get<DeleteUserUseCase.UseCase>(
      DeleteUserUseCase.UseCase
    );

    expect(signupUseCase).toBeInstanceOf(SignupUseCase.UseCase);
    expect(signinUseCase).toBeInstanceOf(SigninUseCase.UseCase);
    expect(getUserUseCase).toBeInstanceOf(GetUserUseCase.UseCase);
    expect(listUsersUseCase).toBeInstanceOf(ListUsersUseCase.UseCase);
    expect(updateUserUseCase).toBeInstanceOf(UpdateUserUseCase.UseCase);
    expect(updatePasswordUseCase).toBeInstanceOf(UpdatePasswordUseCase.UseCase);
    expect(deleteUserUseCase).toBeInstanceOf(DeleteUserUseCase.UseCase);
  });
});
