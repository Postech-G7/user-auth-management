/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationError } from '../../../../../shared/domain/errors/validation-error';
import { UserEntity } from '../../../../domain/entities/user.entity';
import type { User } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: User) {
    const { name, email, password, createdAt } = model;
    const entity = {
      name,
      email,
      password,
      createdAt,
    };
    try {
      return new UserEntity(entity, model.id.toString());
    } catch (e) {
      throw new ValidationError('Entity not loaded');
    }
  }

  static toPrisma(entity: UserEntity) {
    const { name, email, password, createdAt } = entity.toJson();
    return {
      name,
      email,
      password,
      createdAt,
    };
  }
}
