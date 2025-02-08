import { randomUUID } from 'node:crypto';
import { isUUIDValidV4 } from '../../utils/uuidValidate';

type EntityJson<T> = { id: string } & T;

export abstract class Entity<Props = any> {
  public readonly _id: string;
  public readonly props: Props;

  constructor(props: Props, id?: string) {
    if (id && !isUUIDValidV4(id) && isNaN(Number(id))) {
      throw new Error('Invalid id: must be either a UUID v4 or a numeric ID');
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
