import { describe, it, expect } from 'vitest';
import { MockSpaceObjectRepository } from '../repository';

describe('MockSpaceObjectRepository', () => {
  const repo = new MockSpaceObjectRepository();

  it('should return all space objects', async () => {
    const objects = await repo.getAll();
    expect(objects.length).toBeGreaterThan(0);
    expect(objects.length).toBe(14); // based on our mock data
  });

  it('should return a specific space object by id', async () => {
    const obj = await repo.getById('123e4567-e89b-12d3-a456-426614174000');
    expect(obj).not.toBeNull();
    expect(obj?.name).toBe('Sun');
  });

  it('should return null for an invalid id', async () => {
    const obj = await repo.getById('invalid-id');
    expect(obj).toBeNull();
  });

  it('should find objects via search', async () => {
    const results = await repo.search('mars');
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Mars');
  });
});
