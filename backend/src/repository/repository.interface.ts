/**
 * in-memory repository interface
 * @template V type of entity
 * @template K type of id
 */
export interface Repository<K, V> {
  insert(item: V): K;
  update(id: K, partialItem: Partial<V>): V | undefined;
  delete(id: K): boolean;
  find(id: K): V | undefined;
}
