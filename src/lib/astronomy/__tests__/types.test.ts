import { describe, it, expect } from 'vitest';
import { SpaceObjectSchema } from '../../validation/space-object.schema';
import { spaceObjects } from '../../data/mock/space-objects';

describe('Astronomy Types', () => {
  it('should validate all mock space objects against the Zod schema', () => {
    spaceObjects.forEach((obj) => {
      const result = SpaceObjectSchema.safeParse(obj);
      expect(result.success).toBe(true);
    });
  });
});
