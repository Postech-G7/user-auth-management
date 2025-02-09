import { validate } from 'class-validator';
import { SignupDto } from '../dtos/signup.dto';

describe('SignupDto', () => {
  it('should create an instance of SignupDto with valid fields', async () => {
    const dto = new SignupDto();
    dto.name = 'John Doe';
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate missing name', async () => {
    const dto = new SignupDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate invalid email format', async () => {
    const dto = new SignupDto();
    dto.name = 'John Doe';
    dto.email = 'invalid-email';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should validate missing email', async () => {
    const dto = new SignupDto();
    dto.name = 'John Doe';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate missing password', async () => {
    const dto = new SignupDto();
    dto.name = 'John Doe';
    dto.email = 'test@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate non-string name', async () => {
    const dto = new SignupDto();
    dto.name = 12345 as any;
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should validate non-string email', async () => {
    const dto = new SignupDto();
    dto.name = 'John Doe';
    dto.email = 12345 as any;
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should validate non-string password', async () => {
    const dto = new SignupDto();
    dto.name = 'John Doe';
    dto.email = 'test@example.com';
    dto.password = 12345 as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
