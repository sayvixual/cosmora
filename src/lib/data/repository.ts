import { SpaceObject } from '../astronomy/types';
import { spaceObjects } from './mock/space-objects';

export interface ISpaceObjectRepository {
  getAll(): Promise<SpaceObject[]>;
  getById(id: string): Promise<SpaceObject | null>;
  search(query: string): Promise<SpaceObject[]>;
}

export class MockSpaceObjectRepository implements ISpaceObjectRepository {
  async getAll(): Promise<SpaceObject[]> {
    return spaceObjects;
  }

  async getById(id: string): Promise<SpaceObject | null> {
    const obj = spaceObjects.find((o) => o.id === id);
    return obj || null;
  }

  async search(query: string): Promise<SpaceObject[]> {
    const lowerQuery = query.toLowerCase();
    return spaceObjects.filter(
      (o) =>
        o.name.toLowerCase().includes(lowerQuery) ||
        o.canonicalName.toLowerCase().includes(lowerQuery)
    );
  }
}
