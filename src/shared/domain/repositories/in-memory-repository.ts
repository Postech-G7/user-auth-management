import { Entity } from '../entities/entity';
import { NotFoundError } from '../errors/not-found-error';
import { RepositoryInterface } from './repositories-contracts';

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }
  async findById(id: string): Promise<E> {
    return this._get(id);
  }
  async findAll(): Promise<E[]> {
    return this.items;
  }
  async update(newEntity: E): Promise<void> {
    const entityToUpdate = await this._get(newEntity._id);
    const index = this._getIndex(entityToUpdate._id);
    this.items[index] = newEntity;
  }
  async delete(id: string): Promise<void> {
    const entityToDelete = await this._get(id);
    const index = this._getIndex(entityToDelete._id);
    this.items.splice(index, 1);
  }
  protected async _get(id: string): Promise<E> {
    const _id = `${id}`;
    const entity = this.items.find(item => item._id === _id);
    if (!entity) {
      throw new NotFoundError('Entity not found');
    }
    return entity;
  }
  protected _getIndex(id: string): number {
    const _id = `${id}`;
    const index = this.items.findIndex(item => item._id === _id);
    if (index === -1) {
      throw new NotFoundError('Entity not found');
    }
    return index;
  }
}
