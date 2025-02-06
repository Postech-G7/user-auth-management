import { ClassValidatorFields } from '../../class-validator-fields';
import * as libClassValidator from 'class-validator';

interface StubEntity {
  prop: string;
}

let data: StubEntity = {
  prop: 'value',
};

class StubClassValidatorFields extends ClassValidatorFields<StubEntity> {}
let sut = new StubClassValidatorFields();

describe('ClassValidatorFields', () => {
  beforeEach(() => {
    sut = new StubClassValidatorFields();
    data = {
      prop: 'value',
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should inicialize errors as null', () => {
    expect(sut.errors).toBeNull();
  });

  it('should inicialize validatedData as null', () => {
    expect(sut.validatedData).toBeNull();
  });

  it('should return true if data is valid', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([]);

    const validationResult = sut.validate(data);

    expect(validationResult).toBeTruthy();
    expect(sut.errors).toBeNull();
    expect(sut.validatedData).toEqual(data);
  });

  it('should return false if data is invalid', () => {
    const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
    spyValidateSync.mockReturnValue([
      {
        property: 'prop',
        constraints: {
          minLength: 'prop must be longer than or equal to 3 characters',
        },
      },
    ]);

    const validationResult = sut.validate(data);

    expect(validationResult).toBeFalsy();
    expect(sut.errors).toBeDefined();
    expect(sut.errors).toStrictEqual({
      prop: ['prop must be longer than or equal to 3 characters'],
    });
    expect(sut.validatedData).toBeNull();
  });
});
