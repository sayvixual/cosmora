import { z } from 'zod';

export const ObjectTypeSchema = z.enum([
  'planet',
  'moon',
  'star',
  'galaxy',
  'nebula',
  'exoplanet',
  'asteroid',
  'comet',
  'star-cluster',
  'black-hole',
  'other',
]);

export const SpaceObjectSchema = z.object({
  id: z.string().uuid(),
  objectType: ObjectTypeSchema,
  name: z.string().min(1),
  canonicalName: z.string().min(1),
  description: z.string(),
  rightAscension: z.number().optional(),
  declination: z.number().optional(),
  distanceValue: z.number().optional(),
  distanceUnit: z.enum(['pc', 'ly', 'au', 'km']).optional(),
  magnitude: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()),
  status: z.enum(['active', 'deprecated']),
});

export type SpaceObjectValidation = z.infer<typeof SpaceObjectSchema>;
