import { validate } from 'class-validator';
import { UpdatePasswordDto } from '../dtos/update-password.dto';

describe('UpdatePasswordDto', () => {
  it('should create an instance of UpdatePasswordDto with valid fields', async () => {
    const dto = new UpdatePasswordDto();
    dto.password = 'currentPassword123';
    dto.newPassword = 'newPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate missing password', async () => {
    const dto = new UpdatePasswordDto();
    dto.newPassword = 'newPassword123'; // Password ausente

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate missing newPassword', async () => {
    const dto = new UpdatePasswordDto();
    dto.password = 'currentPassword123'; // newPassword ausente

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('newPassword');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate non-string password', async () => {
    const dto = new UpdatePasswordDto();
    dto.password = 12345 as any; // Forçando um valor inválido (não string)
    dto.newPassword = 'newPassword123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should validate non-string newPassword', async () => {
    const dto = new UpdatePasswordDto();
    dto.password = 'currentPassword123';
    dto.newPassword = 12345 as any; // Forçando um valor inválido (não string)

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('newPassword');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
