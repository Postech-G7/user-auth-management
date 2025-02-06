import { Entity } from '../entity';
import { isUUIDValidV4 } from '../../../utils/uuidValidate';
import { faker } from '@faker-js/faker';

type StubEntityProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubEntityProps> {}

describe('Entity unit tests', () => {
  let sut: StubEntity;
  let props: StubEntityProps;

  beforeEach(() => {
    props = {
      prop1: 'prop1',
      prop2: 1,
    } as StubEntityProps;

    sut = new StubEntity(props);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return a valid uuid id of the entity', () => {
    expect(sut._id).toBeDefined();
    expect(isUUIDValidV4(sut._id)).toBeTruthy();
  });

  it('should accept an id', () => {
    const id = faker.string.uuid();
    sut = new StubEntity(props, id);

    expect(sut._id).toBeDefined();
    expect(sut._id).toEqual(id);
    expect(isUUIDValidV4(sut._id)).toBeTruthy();
  });

  it('should return a json props with the id of the entity', () => {
    const entityJson = sut.toJson();
    expect(entityJson).toStrictEqual({
      ...props,
      id: sut.id,
    });
  });
});
