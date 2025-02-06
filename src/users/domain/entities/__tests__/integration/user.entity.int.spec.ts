import { UserEntity, UserProps } from '../../user.entity';
import { userDataBuilder } from '../../../testing/helpers/user-data-builder';

describe('UserEntity integration tests', () => {
  let props: UserProps;
  let sut: UserEntity;

  beforeEach(() => {
    props = userDataBuilder();
    sut = new UserEntity(props);
  });
  describe('Constructor', () => {
    it('Should create a new user entity', () => {
      expect(() => {
        new UserEntity(props);
      }).not.toThrow();
      expect(sut.props).toStrictEqual(props);
      expect(sut.props.name).toEqual(props.name);
      expect(sut.props.email).toEqual(props.email);
      expect(sut.props.password).toEqual(props.password);
      expect(sut.props.createdAt).toBeDefined();
    });
    it('Should throw error when name is invalid', () => {
      expect(() => new UserEntity({ ...props, name: '' })).toThrowError(
        'Entity Validation Error'
      );
      expect(() => new UserEntity({ ...props, name: null })).toThrowError(
        'Entity Validation Error'
      );
      expect(() => new UserEntity({ ...props, name: undefined })).toThrowError(
        'Entity Validation Error'
      );
      expect(() => new UserEntity({ ...props, name: 1 as any })).toThrowError(
        'Entity Validation Error'
      );
      expect(
        () => new UserEntity({ ...props, name: 'a'.repeat(256) })
      ).toThrowError('Entity Validation Error');
    });
    it('Should throw error when password is invalid', () => {
      expect(() => new UserEntity({ ...props, password: '' })).toThrowError(
        'Entity Validation Error'
      );
      expect(
        () => new UserEntity({ ...props, password: 1 as any })
      ).toThrowError('Entity Validation Error');
      expect(
        () => new UserEntity({ ...props, password: 'a'.repeat(256) })
      ).toThrowError('Entity Validation Error');
      expect(() => new UserEntity({ ...props, password: null })).toThrowError(
        'Entity Validation Error'
      );
      expect(
        () => new UserEntity({ ...props, password: undefined })
      ).toThrowError('Entity Validation Error');
    });
    it('Should throw error when email is invalid', () => {
      expect(() => new UserEntity({ ...props, email: '' })).toThrowError(
        'Entity Validation Error'
      );
      expect(
        () => new UserEntity({ ...props, email: '@gmail.com' })
      ).toThrowError('Entity Validation Error');
      expect(() => new UserEntity({ ...props, email: 1 as any })).toThrowError(
        'Entity Validation Error'
      );
      expect(
        () =>
          new UserEntity({ ...props, email: 'a'.repeat(256) + '@gmail.com' })
      ).toThrowError('Entity Validation Error');
      expect(() => new UserEntity({ ...props, email: null })).toThrowError(
        'Entity Validation Error'
      );
      expect(() => new UserEntity({ ...props, email: undefined })).toThrowError(
        'Entity Validation Error'
      );
    });
    it('Should throw error when createdAt is invalid', () => {
      expect(() => new UserEntity({ ...props, email: '' })).toThrowError(
        'Entity Validation Error'
      );
      expect(() => new UserEntity({ ...props, email: 1 as any })).toThrowError(
        'Entity Validation Error'
      );
      expect(
        () =>
          new UserEntity({ ...props, email: 'a'.repeat(256) + '@gmail.com' })
      ).toThrowError('Entity Validation Error');
      expect(() => new UserEntity({ ...props, email: null })).toThrowError(
        'Entity Validation Error'
      );
      expect(() => new UserEntity({ ...props, email: undefined })).toThrowError(
        'Entity Validation Error'
      );
    });
  });

  describe('Setters', () => {
    it('Should throw error when update with invalid name', () => {
      let newName = '';
      expect(() => sut.updateName(newName)).toThrowError(
        'Entity Validation Error'
      );

      newName = 'a'.repeat(256);
      expect(() => sut.updateName(newName)).toThrowError(
        'Entity Validation Error'
      );

      newName = 1 as any;
      expect(() => sut.updateName(newName)).toThrowError(
        'Entity Validation Error'
      );

      newName = null;
      expect(() => sut.updateName(newName)).toThrowError(
        'Entity Validation Error'
      );

      newName = undefined;
      expect(() => sut.updateName(newName)).toThrowError(
        'Entity Validation Error'
      );
    });

    it('Should throw error when update with invalid password', () => {
      let newPassword = '';
      expect(() => sut.updatePassword(newPassword)).toThrowError(
        'Entity Validation Error'
      );

      newPassword = 'a'.repeat(256);
      expect(() => sut.updatePassword(newPassword)).toThrowError(
        'Entity Validation Error'
      );

      newPassword = 1 as any;
      expect(() => sut.updatePassword(newPassword)).toThrowError(
        'Entity Validation Error'
      );

      newPassword = null;
      expect(() => sut.updatePassword(newPassword)).toThrowError(
        'Entity Validation Error'
      );

      newPassword = undefined;
      expect(() => sut.updatePassword(newPassword)).toThrowError(
        'Entity Validation Error'
      );
    });
  });
});
