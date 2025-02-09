import { validate } from 'class-validator';
import { ListUsersDto } from '../dtos/list-users.dto';

describe('ListUsersDto', () => {
  it('should create an instance of ListUsersDto with valid optional fields', async () => {
    const dto = new ListUsersDto();
    dto.page = 1;
    dto.perPage = 10;
    dto.sort = 'name';
    dto.sortDir = 'asc'; // Agora funciona corretamente
    dto.filter = 'John';

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Nenhum erro de validação deve ocorrer
  });

  it('should allow all fields to be undefined (optional)', async () => {
    const dto = new ListUsersDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Nenhum erro de validação deve ocorrer
  });

  it('should validate invalid page (non-numeric value)', async () => {
    const dto = new ListUsersDto();
    dto.page = 'invalid' as any; // Forçando um valor inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('page');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should validate invalid perPage (non-numeric value)', async () => {
    const dto = new ListUsersDto();
    dto.perPage = 'invalid' as any; // Forçando um valor inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('perPage');
    expect(errors[0].constraints).toHaveProperty('isNumber');
  });

  it('should validate invalid sortDir (non-SortDirection value)', async () => {
    const dto = new ListUsersDto();
    dto.sortDir = 'INVALID_DIRECTION' as any; // Forçando um valor inválido

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Deve haver erros de validação
    expect(errors[0].property).toBe('sortDir');
    expect(errors[0].constraints).toHaveProperty('isEnum');
  });
});
