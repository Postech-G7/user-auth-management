import { validate } from 'class-validator';
import { UpdateUserDto } from '../dtos/update-user.dto';

describe('UpdateUserDto', () => {
  it('should create an instance of UpdateUserDto with valid fields', async () => {
    const dto = new UpdateUserDto();
    dto.name = 'New Name';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate missing name', async () => {
    const dto = new UpdateUserDto();
    // name ausente

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should validate non-string name', async () => {
    const dto = new UpdateUserDto();
    dto.name = 12345 as any; // Forçando um valor inválido (não string)

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
