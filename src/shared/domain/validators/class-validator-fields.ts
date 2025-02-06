import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface';
import { validateSync } from 'class-validator';

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsErrors = null;
  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const validateSyncErrors = validateSync(data);
    if (validateSyncErrors.length > 0) {
      this.errors = {};
      for (const error of validateSyncErrors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
      return false;
    } else {
      this.validatedData = data;
    }
    return !validateSyncErrors.length;
  }
}
