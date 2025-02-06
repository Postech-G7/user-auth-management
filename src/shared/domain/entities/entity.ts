import { randomUUID } from 'node:crypto';
import { isUUIDValidV4 } from '../../utils/uuidValidate';

type EntityJson<T> = { id: string } & T;

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    if (id && !isUUIDValidV4(id)) {
      throw new Error('Invalid id');
    }
    this._id = id ?? randomUUID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  toJson(): EntityJson<Props> {
    return {
      ...this.props,
      id: this._id,
    };
  }
}
