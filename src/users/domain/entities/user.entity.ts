import { UserValidatorFactory } from '../validators/user.validator';
import { Entity } from '../../../shared/domain/entities/entity';
import { EntityValidationError } from '../../../shared/domain/errors/validation-error';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string
  ) {
    UserEntity.validate(props);
    super(props, id); //chama o construtor da classe pai
    this.props.createdAt = props.createdAt ?? new Date();
  }
  updateName(value: string) {
    UserEntity.validate({ ...this.props, name: value });
    this.props.name = value;
  }

  updatePassword(value: string) {
    UserEntity.validate({ ...this.props, password: value });
    this.props.password = value;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    //primeiro defino o setter como private para depois criar uma função update que possa ser chamada de fora
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }
  get password(): string {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static validate(data: UserProps) {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(data);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
