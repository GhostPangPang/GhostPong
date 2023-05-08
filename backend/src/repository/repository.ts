/**
 * in-memory repository interface
 * @template T type of entity
 * @template U type of id
 */
export interface Repository<T, U> {
  insert(item: T): U;
  update(id: U, partialItem: Partial<T>): T | undefined;
  delete(id: U): boolean;
  find(id: U): T | undefined;
}
