import {
  CredentialsValidationError,
  InvalidCredentialsError,
} from '../errors/invalid-credentials-error';
import { FieldsErrors } from '../validators/validator-fields.interface';

describe('CredentialsValidationError', () => {
  it('should create an instance of CredentialsValidationError', () => {
    const error = new CredentialsValidationError();
    expect(error).toBeInstanceOf(CredentialsValidationError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('');
    expect(error.name).toBe('InvalidCredentialsError');
  });
});

describe('InvalidCredentialsError', () => {
  it('should create an instance of InvalidCredentialsError with default message and errors', () => {
    const mockErrors: FieldsErrors = {
      email: ['email is required'],
      password: ['password must be at least 6 characters'],
    };

    const error = new InvalidCredentialsError(mockErrors);

    expect(error).toBeInstanceOf(InvalidCredentialsError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Invalid Credentials');
    expect(error.name).toBe('InvalidCredentialsError');
    expect(error.errors).toEqual(mockErrors);
  });

  it('should throw InvalidCredentialsError with custom errors', () => {
    const mockErrors: FieldsErrors = {
      username: ['username is required'],
    };

    const error = new InvalidCredentialsError(mockErrors);

    expect(() => {
      throw error;
    }).toThrowError(InvalidCredentialsError);
    expect(error.message).toBe('Invalid Credentials');
    expect(error.errors).toEqual(mockErrors);
  });
});
