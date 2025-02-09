import { validate } from 'class-validator';
import { SigninDto } from '../dtos/signin.dto';

describe('SigninDto', () => {
  it('should create an instance of SigninDto with valid fields', async () => {
    const dto = new SigninDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Nenhum erro de validação deve ocorrer
  });

  it('should validate missing email', async () => {
    const dto = new SigninDto();
    dto.password = 'password123'; // Email ausente

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate invalid email format', async () => {
    const dto = new SigninDto();
    dto.email = 'invalid-email'; // Formato inválido de email
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should validate missing password', async () => {
    const dto = new SigninDto();
    dto.email = 'test@example.com'; // Password ausente

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate non-string password', async () => {
    const dto = new SigninDto();
    dto.email = 'test@example.com';
    dto.password = 12345 as any; // Forçando um valor inválido (não string)

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
