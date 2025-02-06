import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserProps } from '../entities/user.entity';
import { ClassValidatorFields } from '../../../shared/domain/validators/class-validator-fields';

export class UserRules {
  @MinLength(1)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @MinLength(8)
  @MaxLength(255)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  constructor(data: UserProps) {
    Object.assign(this, data);
  }
}

export class UserValidator extends ClassValidatorFields<UserRules> {
  validate(data: UserProps) {
    return data && super.validate(new UserRules(data));
  }
}

export class UserValidatorFactory {
  static create() {
    return new UserValidator();
  }
}
